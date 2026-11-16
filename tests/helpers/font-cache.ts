import type { Buffer } from "node:buffer";
import type { Route } from "@playwright/test";

interface FontAsset {
  body: Buffer;
  headers: Record<string, string>;
  status: number;
}

// Playwright workers load this module separately; cache only immutable font URLs.
const fontAssets = new Map<string, Promise<FontAsset>>();

async function fetchFontAsset(route: Route): Promise<FontAsset> {
  const response = await route.fetch();

  if (!response.ok()) {
    const status = response.status();
    await response.dispose();
    throw new Error(`Pinned font request failed with HTTP ${status}`);
  }

  try {
    const headers = response.headers();
    delete headers["content-encoding"];
    delete headers["content-length"];
    delete headers["transfer-encoding"];

    return { body: await response.body(), headers, status: response.status() };
  } finally {
    await response.dispose();
  }
}

export async function reusePinnedFont(route: Route): Promise<void> {
  const url = route.request().url();
  let asset = fontAssets.get(url);

  if (asset === undefined) {
    asset = fetchFontAsset(route);
    fontAssets.set(url, asset);
  }

  await route.fulfill(await asset);
}
