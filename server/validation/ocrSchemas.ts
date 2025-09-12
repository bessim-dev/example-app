import { z } from "zod";

const base64Image = z.string().min(1, "Image is required (base64 string)");

export const ocrRequestSchema = z
  .object({
    image: base64Image.optional(),
    images: z.array(base64Image).min(1).optional(),
    fields: z.array(z.string().min(1)).optional(),
  })
  .refine((data) => Boolean(data.image) || (Array.isArray(data.images) && data.images.length > 0), {
    message: "Provide either 'image' or non-empty 'images' array",
    path: ["images"],
  });
