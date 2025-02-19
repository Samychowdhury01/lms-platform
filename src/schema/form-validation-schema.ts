import { z } from "zod";

const requiredString = z.string().min(1, {
  message: "This field is required",
});

export const createCourseTitleValidationSchema = z.object({
  title: requiredString,
});

export type TCreateCourseTitle = z.infer<typeof createCourseTitleValidationSchema>;


export const createCourseValidationSchema = z.object({
  userId: requiredString.optional(),
  description: requiredString.optional(),
  imageUrl: requiredString.url({ message: "Invalid image URL" }).optional(),
  price: z.number().positive().optional(),
  isPublished: z.boolean().default(false),
  categoryId: z.string().optional(), 
  createdAt: z.date().default(new Date()),
  updatedAt: z.date().optional(),
});

export type TCourse = z.infer<typeof createCourseValidationSchema>;

