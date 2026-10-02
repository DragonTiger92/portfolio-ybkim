export interface ProjectSchemaInput {
  slug: string;
  title: string;
  summary: string;
  stack: readonly string[];
}

interface SchemaReference {
  "@id": string;
}

interface ProjectWebPage extends SchemaReference {
  "@type": "WebPage";
  name: string;
  description: string;
  url: string;
  inLanguage: "ko";
  mainEntity: SchemaReference;
  breadcrumb: SchemaReference;
}

interface ProjectWork extends SchemaReference {
  "@type": "CreativeWork";
  name: string;
  description: string;
  url: string;
  inLanguage: "ko";
  keywords?: readonly string[];
  mainEntityOfPage: SchemaReference;
}

interface ProjectBreadcrumb extends SchemaReference {
  "@type": "BreadcrumbList";
  itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item: string;
  }>;
}

export interface ProjectStructuredData extends Record<string, unknown> {
  "@context": "https://schema.org";
  "@graph": [ProjectWebPage, ProjectWork, ProjectBreadcrumb];
}

export function createProjectStructuredData(
  project: ProjectSchemaInput,
  site: URL,
): ProjectStructuredData {
  const projectUrl = new URL(`/projects/${project.slug}/`, site).href;
  const pageReference = { "@id": `${projectUrl}#webpage` };
  const projectReference = { "@id": `${projectUrl}#project` };
  const breadcrumbReference = { "@id": `${projectUrl}#breadcrumb` };

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        ...pageReference,
        "@type": "WebPage",
        name: project.title,
        description: project.summary,
        url: projectUrl,
        inLanguage: "ko",
        mainEntity: projectReference,
        breadcrumb: breadcrumbReference,
      },
      {
        ...projectReference,
        "@type": "CreativeWork",
        name: project.title,
        description: project.summary,
        url: projectUrl,
        inLanguage: "ko",
        ...(project.stack.length > 0 ? { keywords: [...project.stack] } : {}),
        mainEntityOfPage: pageReference,
      },
      {
        ...breadcrumbReference,
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "프로젝트 목록",
            item: new URL("/#projects", site).href,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: project.title,
            item: projectUrl,
          },
        ],
      },
    ],
  };
}

export function serializeStructuredData(structuredData: Record<string, unknown>): string {
  return JSON.stringify(structuredData).replaceAll("<", "\\u003c");
}
