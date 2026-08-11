import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createServer } from "node:http";
import { once } from "node:events";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

import { runHttpSmoke, runHttpSmokeWithRetry, validateBaseUrl } from "./check-http-smoke.mjs";

const scriptPath = fileURLToPath(new URL("./check-http-smoke.mjs", import.meta.url));

async function startServer(handler) {
  const server = createServer(handler);

  server.listen(0, "127.0.0.1");
  await once(server, "listening");

  const address = server.address();

  if (address === null || typeof address === "string") {
    throw new Error("Test server did not expose a TCP address.");
  }

  return {
    baseUrl: `http://127.0.0.1:${address.port}/`,
    close: async () => {
      server.close();
      await once(server, "close");
    },
  };
}

function sendTargetResponse(
  request,
  response,
  { manifestContentType = "application/manifest+json" } = {},
) {
  if (request.url === "/") {
    response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    response.end('<h1 id="portfolio-title">Portfolio</h1>');
    return;
  }

  if (request.url === "/assets/brand/logo-mark.svg") {
    response.writeHead(200, { "Content-Type": "image/svg+xml" });
    response.end('<svg viewBox="0 0 10 10"></svg>');
    return;
  }

  response.writeHead(200, { "Content-Type": manifestContentType });
  response.end('{"short_name":"Portfolio"}');
}

function countRequest(requestCounts, path) {
  requestCounts.set(path, (requestCounts.get(path) ?? 0) + 1);
}

describe("smoke-check base URL", () => {
  it("allows HTTPS origins and loopback HTTP only", () => {
    assert.equal(validateBaseUrl("https://portfolio.example/").origin, "https://portfolio.example");
    assert.equal(validateBaseUrl("http://127.0.0.1:4321/").port, "4321");
    assert.throws(() => validateBaseUrl("http://example.com/"), /must use HTTPS/u);
  });

  it("rejects credentials, query strings, fragments, and paths", () => {
    assert.throws(() => validateBaseUrl("https://user@example.com/"), /credentials/u);
    assert.throws(() => validateBaseUrl("https://example.com/?test=1"), /query/u);
    assert.throws(() => validateBaseUrl("https://example.com/#test"), /fragment/u);
    assert.throws(() => validateBaseUrl("https://example.com/portfolio/"), /without a path/u);
  });
});

describe("HTTP smoke checks", () => {
  it("verifies the homepage and critical asset markers", async () => {
    const server = await startServer(sendTargetResponse);

    try {
      assert.deepEqual(await runHttpSmoke({ baseUrl: server.baseUrl }), [
        "/",
        "/assets/brand/logo-mark.svg",
        "/assets/brand/site.webmanifest",
      ]);
    } finally {
      await server.close();
    }
  });

  it("rejects cross-origin redirects before following them", async () => {
    const server = await startServer((_request, response) => {
      response.writeHead(302, { Location: "https://example.com/" });
      response.end();
    });

    try {
      await assert.rejects(
        runHttpSmoke({ baseUrl: server.baseUrl }),
        /Cross-origin smoke-check redirect/u,
      );
    } finally {
      await server.close();
    }
  });

  it("rejects a successful response with the wrong content marker", async () => {
    const server = await startServer((_request, response) => {
      response.writeHead(200, { "Content-Type": "text/html" });
      response.end("<h1>Unexpected page</h1>");
    });

    try {
      await assert.rejects(
        runHttpSmoke({ baseUrl: server.baseUrl }),
        /did not contain the stable marker/u,
      );
    } finally {
      await server.close();
    }
  });

  it("rejects the web manifest without its registered media type", async () => {
    const server = await startServer((request, response) => {
      sendTargetResponse(request, response, { manifestContentType: "application/json" });
    });

    try {
      await assert.rejects(runHttpSmoke({ baseUrl: server.baseUrl }), /Content-Type/u);
    } finally {
      await server.close();
    }
  });
});

describe("HTTP smoke retry recovery", () => {
  it("retries the complete smoke after a transient manifest Content-Type mismatch", async () => {
    const requestCounts = new Map();
    const retryEvents = [];
    const waits = [];
    const server = await startServer((request, response) => {
      countRequest(requestCounts, request.url);
      const manifestContentType =
        request.url === "/assets/brand/site.webmanifest" && requestCounts.get(request.url) === 1
          ? "application/json"
          : "application/manifest+json";
      sendTargetResponse(request, response, { manifestContentType });
    });

    try {
      assert.deepEqual(
        await runHttpSmokeWithRetry({
          attempts: 4,
          baseUrl: server.baseUrl,
          onRetry: (event) => retryEvents.push(event),
          retryDelayMilliseconds: 5_000,
          waitImplementation: async (milliseconds) => waits.push(milliseconds),
        }),
        ["/", "/assets/brand/logo-mark.svg", "/assets/brand/site.webmanifest"],
      );
      assert.deepEqual([...requestCounts.values()], [2, 2, 2]);
      assert.deepEqual(waits, [5_000]);
      assert.deepEqual(retryEvents, [{ attempt: 1, attempts: 4, retryDelayMilliseconds: 5_000 }]);
    } finally {
      await server.close();
    }
  });
});

describe("HTTP smoke retry exhaustion", () => {
  it("fails with the final Content-Type error after the bounded retry schedule", async () => {
    const requestCounts = new Map();
    const waits = [];
    const server = await startServer((request, response) => {
      countRequest(requestCounts, request.url);
      sendTargetResponse(request, response, { manifestContentType: "application/json" });
    });

    try {
      await assert.rejects(
        runHttpSmokeWithRetry({
          attempts: 4,
          baseUrl: server.baseUrl,
          retryDelayMilliseconds: 5_000,
          waitImplementation: async (milliseconds) => waits.push(milliseconds),
        }),
        /site\.webmanifest returned Content-Type/u,
      );
      assert.deepEqual([...requestCounts.values()], [4, 4, 4]);
      assert.deepEqual(waits, [5_000, 10_000, 20_000]);
    } finally {
      await server.close();
    }
  });
});

describe("HTTP smoke retry safeguards", () => {
  it("rejects invalid retry configuration before making a request", async () => {
    let requestCount = 0;
    const fetchImplementation = async () => {
      requestCount += 1;
      throw new Error("Unexpected request.");
    };

    await assert.rejects(
      runHttpSmokeWithRetry({
        attempts: 0,
        baseUrl: "https://portfolio.example/",
        fetchImplementation,
      }),
      /--attempts must be a positive integer/u,
    );
    await assert.rejects(
      runHttpSmokeWithRetry({
        baseUrl: "https://portfolio.example/",
        fetchImplementation,
        retryDelayMilliseconds: -1,
      }),
      /--retry-delay-ms must be a non-negative integer/u,
    );
    assert.equal(requestCount, 0);
  });

  it("preserves the request timeout across retries", async () => {
    let requestCount = 0;
    const fetchImplementation = (_url, { signal }) =>
      new Promise((_resolve, reject) => {
        requestCount += 1;
        signal.addEventListener("abort", () => reject(new Error("request timeout observed")), {
          once: true,
        });
      });

    await assert.rejects(
      runHttpSmokeWithRetry({
        attempts: 2,
        baseUrl: "https://portfolio.example/",
        fetchImplementation,
        retryDelayMilliseconds: 0,
        timeoutMilliseconds: 1,
        waitImplementation: async () => {},
      }),
      /request timeout observed/u,
    );
    assert.equal(requestCount, 2);
  });
});

describe("HTTP smoke CLI", () => {
  it("maps missing CLI configuration to exit code 1", () => {
    const environment = { ...process.env };
    delete environment.SMOKE_BASE_URL;

    const execution = spawnSync(process.execPath, [scriptPath], {
      encoding: "utf8",
      env: environment,
    });

    assert.equal(execution.status, 1);
    assert.match(execution.stderr, /HTTP smoke check failed: Provide --base-url/u);
  });
});
