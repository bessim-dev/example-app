import { z } from "zod";

export const ocrRequestSchema = z.object({
  image: z.string().min(1, "Image is required (base64 string)"),
});
