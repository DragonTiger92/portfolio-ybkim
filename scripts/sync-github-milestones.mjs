import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const apiVersion = "2022-11-28";
const defaultRoadmapPath = "docs/planning/roadmap.md";

function cleanCell(value) {
  return value.trim().replaceAll("`", "");
}

export function parseRoadmap(markdown) {
  return markdown
    .split("\n")
    .map((line) => line.match(/^\|\s*`(PH-\d{3})`\s*\|([^|]+)\|([^|]+)\|([^|]+)\|([^|]+)\|$/))
    .filter(Boolean)
    .map((match) => ({
      goal: cleanCell(match[5]),
      id: match[1],
      name: cleanCell(match[2]),
      releaseTarget: cleanCell(match[4]),
      status: cleanCell(match[3]),
    }));
}

export function parseRoadmapPhase(body = "") {
  const match = body.match(
    /^#{2,3}\s+Roadmap [Pp]hase(?:\s*\/\s*Milestone)?\s*\n+\s*`?(PH-\d{3})`?/m,
  );
  return match?.[1] ?? null;
}

export function parseClosingIssueNumbers(body = "") {
  const pattern = /(?:close[sd]?|fix(?:e[sd])?|resolve[sd]?)\s+#(\d+)\b/gi;
  return [...new Set([...body.matchAll(pattern)].map((match) => Number(match[1])))];
}

function createClient({ repository, token }) {
  const baseUrl = `https://api.github.com/repos/${repository}`;

  async function request(path, { body, method = "GET" } = {}) {
    const response = await fetch(`${baseUrl}${path}`, {
      body: body ? JSON.stringify(body) : undefined,
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": apiVersion,
      },
      method,
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`${method} ${path} failed: ${response.status} ${detail}`);
    }

    if (response.status === 204) {
      return null;
    }

    return response.json();
  }

  async function paginate(path) {
    const separator = path.includes("?") ? "&" : "?";
    const items = [];
    let page = 1;
    let batch;

    do {
      batch = await request(`${path}${separator}per_page=100&page=${page}`);
      items.push(...batch);
      page += 1;
    } while (batch.length === 100);

    return items;
  }

  return { paginate, request };
}

function milestoneDescription(phase) {
  return [
    `Roadmap phase ${phase.id}: ${phase.name}`,
    "",
    `Roadmap status: ${phase.status}`,
    `Goal: ${phase.goal}`,
    `Release target: ${phase.releaseTarget}`,
    "Source: docs/planning/roadmap.md",
  ].join("\n");
}

async function syncPhaseMilestone(client, existingMilestones, phase) {
  const existing = existingMilestones.find((item) => item.title.startsWith(`${phase.id} `));
  const body = {
    description: milestoneDescription(phase),
    title: `${phase.id} ${phase.name}`,
  };

  if (!existing) {
    return client.request("/milestones", { body, method: "POST" });
  }

  return client.request(`/milestones/${existing.number}`, {
    body,
    method: "PATCH",
  });
}

async function syncMilestones(client, phases) {
  const existing = await client.paginate("/milestones?state=all");
  const synced = [];

  // GitHub can intermittently reject concurrent milestone creation requests.
  for (const phase of phases) {
    synced.push(await syncPhaseMilestone(client, existing, phase));
  }

  return new Map(phases.map((phase, index) => [phase.id, synced[index]]));
}

async function assignIssue(client, milestoneByPhase, issue) {
  const phase = parseRoadmapPhase(issue.body);
  const milestone = milestoneByPhase.get(phase);

  if (!milestone || issue.milestone?.number === milestone.number) {
    return;
  }

  await client.request(`/issues/${issue.number}`, {
    body: { milestone: milestone.number },
    method: "PATCH",
  });
}

async function syncIssueAssignments(client, milestoneByPhase) {
  const items = await client.paginate("/issues?state=all");
  const issues = items.filter((item) => !item.pull_request);
  await Promise.all(issues.map((issue) => assignIssue(client, milestoneByPhase, issue)));
}

async function assignPullRequest(client, pullRequest) {
  const issueNumbers = parseClosingIssueNumbers(pullRequest.body);

  if (issueNumbers.length === 0) {
    return;
  }

  const issues = await Promise.all(
    issueNumbers.map((number) => client.request(`/issues/${number}`)),
  );
  const milestoneNumbers = new Set(issues.map((issue) => issue.milestone?.number).filter(Boolean));

  if (milestoneNumbers.size !== 1) {
    return;
  }

  const milestone = [...milestoneNumbers][0];

  if (pullRequest.milestone?.number === milestone) {
    return;
  }

  await client.request(`/issues/${pullRequest.number}`, {
    body: { milestone },
    method: "PATCH",
  });
}

async function syncPullRequestAssignments(client) {
  const pullRequests = await client.paginate("/pulls?state=all");
  await Promise.all(pullRequests.map((pullRequest) => assignPullRequest(client, pullRequest)));
}

async function hasMergedPullRequest(client, items) {
  const pullRequests = items.filter((item) => item.pull_request);
  const details = await Promise.all(
    pullRequests.map((item) => client.request(`/pulls/${item.number}`)),
  );
  return details.some((pullRequest) => Boolean(pullRequest.merged_at));
}

async function reconcileMilestone(client, milestone) {
  const items = await client.paginate(`/issues?state=all&milestone=${milestone.number}`);

  if (items.length === 0) {
    return;
  }

  const allClosed = items.every((item) => item.state === "closed");
  const merged = await hasMergedPullRequest(client, items);
  const desiredState = allClosed && merged ? "closed" : "open";

  if (milestone.state === desiredState) {
    return;
  }

  await client.request(`/milestones/${milestone.number}`, {
    body: { state: desiredState },
    method: "PATCH",
  });
}

async function reconcileMilestones(client, milestoneByPhase) {
  await Promise.all(
    [...milestoneByPhase.values()].map((milestone) => reconcileMilestone(client, milestone)),
  );
}

export async function syncGitHubMilestones({ repository, roadmap, token }) {
  const phases = parseRoadmap(roadmap);

  if (phases.length === 0) {
    throw new Error("No roadmap phases were found.");
  }

  const client = createClient({ repository, token });
  const milestoneByPhase = await syncMilestones(client, phases);
  await syncIssueAssignments(client, milestoneByPhase);
  await syncPullRequestAssignments(client);
  await reconcileMilestones(client, milestoneByPhase);
}

async function run() {
  const repository = process.env.GITHUB_REPOSITORY;
  const token = process.env.GITHUB_TOKEN;

  if (!repository || !token) {
    throw new Error("GITHUB_REPOSITORY and GITHUB_TOKEN are required.");
  }

  const roadmap = await readFile(process.env.ROADMAP_PATH ?? defaultRoadmapPath, "utf8");
  await syncGitHubMilestones({ repository, roadmap, token });
}

const isDirectExecution =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectExecution) {
  await run();
}
