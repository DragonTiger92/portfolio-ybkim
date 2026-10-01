export const visualContainerImage =
  "mcr.microsoft.com/playwright:v1.63.0-noble@sha256:eff16c30e6f3f4af0a03fa4b706120d5e9b0891c344a27d64559aff5900a4a27";

export function assertVisualEnvironment(platform = process.platform, environment = process.env) {
  if (platform !== "linux" || environment.PORTFOLIO_VISUAL_IMAGE !== visualContainerImage) {
    throw new Error(
      "Visual comparisons require the pinned Linux container. Use the Visual Tests workflow; Windows Edge cannot create its baselines.",
    );
  }
}

export default function setup() {
  assertVisualEnvironment();
}
