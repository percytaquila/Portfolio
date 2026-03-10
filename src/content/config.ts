import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const certifications = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: "./src/content/certifications",
  }),
  schema: z.object({
    title: z.string(),
    cert: z.string().optional(),
    modules: z
      .array(
        z.object({
          num: z.string(),
          title: z.string(),
          status: z.enum(["done", "wip", "next"]).optional(),
        }),
      )
      .optional(),
  }),
});

export const collections = { certifications };
