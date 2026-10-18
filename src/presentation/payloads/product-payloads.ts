import z from "zod";

export const FILE_MAX_SIZE_MB = 5;
export const FILE_MAX_SIZE_BYTES = FILE_MAX_SIZE_MB * 1024 * 1024;
export const ACCEPTED_FILES = ["image/png", "image/jpeg", "image/webp"];

const nameSchema = z
  .string()
  .trim()
  .min(3, "O nome deve ter no mínimo 3 caracteres.")
  .max(100, "O nome deve ter no máximo 100 caracteres.");

const imageSchema = z
  .instanceof(File)
  .refine((f) => ACCEPTED_FILES.includes(f.type), "Formato não suportado.")
  .refine(
    (f) => f.size <= FILE_MAX_SIZE_BYTES,
    `O arquivo deve ter no máximo ${FILE_MAX_SIZE_MB} MB.`,
  )
  .nullable();

export const createProductSchema = z.object({
  name: nameSchema,
  image: imageSchema,
});

export type CreateProductPayload = z.infer<typeof createProductSchema>;

export const updateProductSchema = z
  .object({
    name: nameSchema,
    image: imageSchema,
    removeImage: z.boolean(),
  })
  .refine((data) => !(data.image && data.removeImage), {
    error: "Não é possível enviar e remover a imagem ao mesmo tempo",
    path: ["image"],
  });

export type UpdateProductPayload = z.infer<typeof updateProductSchema>;
