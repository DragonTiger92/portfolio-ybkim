import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const projects = defineCollection({
  loader: glob({ base: "./src/content/projects", pattern: "**/*.md" }),
  schema: z.object({
    title: z.string(),
    classification: z.enum(["개인 공개 프로젝트", "부트캠프 공개 팀 프로젝트"]),
    summary: z.string(),
    role: z.string(),
    contribution: z.string(),
    focus: z.string(),
    tags: z.array(z.string()).min(1),
    stack: z.array(z.string()),
    order: z.number().int().nonnegative(),
    links: z
      .array(
        z.object({
          label: z.string(),
          href: z.url(),
          showOnCard: z.boolean().default(false),
        }),
      )
      .default([]),
  }),
});

export const collections = { projects };
