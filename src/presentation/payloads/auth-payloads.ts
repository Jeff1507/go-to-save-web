import z from "zod";

export const signupSchema = z
  .object({
    email: z.email("O email deve ser válido"),
    name: z
      .string()
      .min(3, "O nome deve ser maior que 3 caracteres")
      .max(100, "O nome deve ser menor que 100 caracteres"),
    cnpj: z.string().length(14, "O cnpj deve ser válido"),
    password: z
      .string()
      .min(8, "A senha deve ser maior que 8 caracteres")
      .max(72, "A senha deve ser menor que 72 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type SignupPayload = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: z.email("O email deve ser válido"),
  password: z
    .string()
    .min(8, "A senha deve ser maior que 8 caracteres")
    .max(72, "A senha deve ser menor que 72 caracteres"),
});

export type LoginPayload = z.infer<typeof loginSchema>;

export const requestPasswordResetSchema = z.object({
  email: z.email("O email deve ser válido"),
});

export type RequestPasswordResetPayload = z.infer<
  typeof requestPasswordResetSchema
>;

export const resetPasswordSchema = z
  .object({
    email: z.email("O email deve ser válido"),
    code: z.string().regex(/^\d{6}$/, "O código deve ter exatamente 6 dígitos"),
    newPassword: z
      .string()
      .min(8, "A senha deve ser maior que 8 caracteres")
      .max(72, "A senha deve ser menor que 72 caracteres"),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    error: "As senhas não coincidem",
    path: ["confirmNewPassword"],
  });

export type ResetPasswordPayload = z.infer<typeof resetPasswordSchema>;

export const verifyEmailSchema = z.object({
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "O código deve ter 6 dígitos."),
});

export type VerifyEmailPayload = z.infer<typeof verifyEmailSchema>;
