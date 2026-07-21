interface SectionTarget {
  id: string;
  link: HTMLAnchorElement;
  section: HTMLElement;
}

const progressHeader = document.querySelector<HTMLElement>("[data-page-progress]");
const sectionLinks = [...document.querySelectorAll<HTMLAnchorElement>("[data-section-link]")];
const sectionTargets = sectionLinks.flatMap<SectionTarget>((link) => {
  const section = document.querySelector<HTMLElement>(link.hash);

  return section === null ? [] : [{ id: section.id, link, section }];
});

function getCurrentSectionId(): string | undefined {
  const headerOffset = (progressHeader?.offsetHeight ?? 0) + window.innerHeight * 0.25;
  const visibleTargets = sectionTargets.filter(
    ({ section }) => section.getBoundingClientRect().top <= headerOffset,
  );

  return visibleTargets.at(-1)?.id ?? sectionTargets[0]?.id;
}

function updateCurrentLink(target: SectionTarget, currentSectionId: string | undefined): void {
  if (target.id !== currentSectionId) {
    target.link.removeAttribute("aria-current");
    return;
  }

  target.link.setAttribute("aria-current", "location");
}

function updateNavigationProgress(): void {
  if (progressHeader === null || sectionTargets.length === 0) {
    return;
  }

  const scrollRange = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollRange > 0 ? Math.min(window.scrollY / scrollRange, 1) : 0;
  const currentSectionId = getCurrentSectionId();

  progressHeader.style.setProperty("--page-progress", String(progress));
  sectionTargets.forEach((target) => updateCurrentLink(target, currentSectionId));
}

updateNavigationProgress();
window.addEventListener("scroll", updateNavigationProgress, { passive: true });
window.addEventListener("resize", updateNavigationProgress);
