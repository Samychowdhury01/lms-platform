import { z } from "zod";

const requiredString = z.string().min(1, {
  message: "This field is required",
});

export const createCourseValidationSchema = z.object({
  title: requiredString,
});

export type TCreateCourse = z.infer<typeof createCourseValidationSchema>;
