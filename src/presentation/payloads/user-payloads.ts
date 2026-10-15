import z from "zod";

export const addressSchema = z.object({
  postalCode: z.string().regex(/^\d{8}$/, "CEP inválido"),
  street: z.string().min(1, "Rua obrigatória"),
  number: z.string().min(1, "Número obrigatório"),
  neighborhood: z.string().min(1, "Bairro obrigatório"),
  complement: z.string().nullable(),
  city: z.string().min(1, "Cidade obrigatória"),
  state: z.string().length(2, "UF inválida"),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export const addressFormSchema = addressSchema.omit({
  latitude: true,
  longitude: true,
});

export type AddressPayload = z.infer<typeof addressSchema>;
export type AddressFormValues = z.infer<typeof addressFormSchema>;
