// src/content/config.ts
import { defineCollection, z } from "astro:content";

const certifications = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    academy: z.string(),
    instructor: z.string().optional(),
    duration: z.string().optional(),
    status: z.enum(["completed", "in-progress", "planned"]),
    cert: z.string(),
    url: z.string().url().optional(),
    rating: z.number().min(1).max(5).optional(),
    summary: z.string().optional(),
    modules: z
      .array(
        z.object({
          num: z.string(),
          title: z.string(),
          status: z.enum(["done", "wip", "next"]),
        }),
      )
      .optional(),
  }),
});

export const collections = { certifications };
