import { z } from "zod";
const requiredString = z.string().min(1, {
  message: "This field is required",
});

export const muxDataSchema = z.object({
  assetId: requiredString,
  playbackId: requiredString,
  chapterId: requiredString,
});

export type TMuxDataType = z.infer<typeof muxDataSchema>;

export const chapterValidationSchema = z.object({
  description: requiredString.optional(),
  videoUrl: requiredString.url({ message: "Invalid Video URL" }).optional(),
  muxData: muxDataSchema.optional(),
  position: z.number().positive().optional(),
  isPublished: z.boolean().default(false),
  courseId: z.string().optional(),
});

export const chapterDescriptionValidationSchema = z.object({
  description: requiredString.refine(
    (val) => val.replace(/<\/?[^>]+(>|$)/g, "").trim() !== "",
    {
      message: "Description cannot be empty",
    }
  ),
});
export const chapterVideoUrlValidationSchema = z.object({
  videoUrl: requiredString.url({ message: "Invalid Video URL" }),
});
export const chapterIsPublishedValidationSchema = z.object({
  isPublished: z.boolean({
    required_error: "This field is required",
  }),
});
export const chapterIsFreeValidationSchema = z.object({
  isFree: z
    .boolean({
      required_error: "This field is required",
    })
    .default(false),
});

export type TChapterDescription = z.infer<
  typeof chapterDescriptionValidationSchema
>;
export type TChapterVideoUrl = z.infer<typeof chapterVideoUrlValidationSchema>;
export type TChapterIsPublished = z.infer<
  typeof chapterIsPublishedValidationSchema
>;
export type TChapterIsFree = z.infer<typeof chapterIsFreeValidationSchema>;

export type TChapter = z.infer<typeof chapterValidationSchema>;
