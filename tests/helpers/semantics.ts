import type { Page } from "@playwright/test";

export interface HeadingOutlineEntry {
  level: number;
  text: string;
}

interface TargetSizeFailure {
  height: number;
  label: string;
  width: number;
}

export async function getHeadingOutline(page: Page) {
  return page.locator("h1, h2, h3, h4, h5, h6").evaluateAll<HeadingOutlineEntry[]>((headings) =>
    headings.map((heading) => ({
      level: Number.parseInt(heading.tagName.slice(1), 10),
      text: heading.textContent?.replace(/\s+/g, " ").trim() ?? "",
    })),
  );
}

export async function getTargetSizeFailures(page: Page) {
  return page.evaluate<TargetSizeFailure[]>(() => {
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>('a, button, input, select, textarea, [role="button"]'),
    );

    function inspectTarget(target: HTMLElement): TargetSizeFailure | null {
      const rectangle = target.getBoundingClientRect();
      const isVisible = rectangle.width > 0 && rectangle.height > 0;
      const isLargeEnough = rectangle.width >= 44 && rectangle.height >= 44;

      if (!isVisible || isLargeEnough) {
        return null;
      }

      const targetName = target.getAttribute("aria-label") ?? target.innerText.trim();

      return {
        height: Math.round(rectangle.height),
        label: targetName || target.tagName,
        width: Math.round(rectangle.width),
      };
    }

    return targets.map(inspectTarget).filter((failure) => failure !== null);
  });
}

export async function getUntitledSectioningElements(page: Page) {
  return page.evaluate<string[]>(() => {
    const containers = Array.from(document.querySelectorAll<HTMLElement>("section, article"));

    return containers.flatMap((container) => {
      const headings = Array.from(container.querySelectorAll("h1, h2, h3, h4, h5, h6"));
      const ownsHeading = headings.some(
        (heading) => heading.closest("section, article") === container,
      );

      return ownsHeading ? [] : [container.id || container.className || container.tagName];
    });
  });
}
