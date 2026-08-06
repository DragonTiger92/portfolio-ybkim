import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createServer } from "node:http";
import { once } from "node:events";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

import {
  createAccessServiceTokenHeaders,
  runHttpSmoke,
  validateBaseUrl,
} from "./check-http-smoke.mjs";

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
    const server = await startServer((request, response) => {
      if (request.url === "/") {
        response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        response.end('<h1 id="portfolio-title">Portfolio</h1>');
        return;
      }

      response.writeHead(200, { "Content-Type": "image/svg+xml" });
      response.end('<svg viewBox="0 0 10 10"></svg>');
    });

    try {
      assert.deepEqual(await runHttpSmoke({ baseUrl: server.baseUrl }), [
        "/",
        "/assets/brand/logo-mark.svg",
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

describe("Access-authenticated HTTP smoke checks", () => {
  it("forwards service-token headers without exposing them in output", async () => {
    const expectedHeaders = createAccessServiceTokenHeaders({
      CF_ACCESS_CLIENT_ID: "preview-client-id",
      CF_ACCESS_CLIENT_SECRET: "preview-client-secret",
    });
    const receivedHeaders = [];
    const server = await startServer((request, response) => {
      receivedHeaders.push({
        clientId: request.headers["cf-access-client-id"],
        clientSecret: request.headers["cf-access-client-secret"],
      });

      if (request.url === "/") {
        response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        response.end('<h1 id="portfolio-title">Portfolio</h1>');
        return;
      }

      response.writeHead(200, { "Content-Type": "image/svg+xml" });
      response.end('<svg viewBox="0 0 10 10"></svg>');
    });

    try {
      await runHttpSmoke({ baseUrl: server.baseUrl, headers: expectedHeaders });
      assert.deepEqual(receivedHeaders, [
        { clientId: "preview-client-id", clientSecret: "preview-client-secret" },
        { clientId: "preview-client-id", clientSecret: "preview-client-secret" },
      ]);
    } finally {
      await server.close();
    }
  });

  it("requires both Access service-token values", () => {
    assert.throws(
      () => createAccessServiceTokenHeaders({ CF_ACCESS_CLIENT_ID: "client-id" }),
      /CF_ACCESS_CLIENT_SECRET/u,
    );
  });
});
