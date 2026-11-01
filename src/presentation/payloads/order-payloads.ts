import z from "zod";

export const CONFIRMATION_CODE_LENGTH = 4;

export const completeOrderSchema = z.object({
  confirmationCode: z
    .string()
    .trim()
    .regex(
      new RegExp(`^\\d{${CONFIRMATION_CODE_LENGTH}}$`),
      `O código deve ter ${CONFIRMATION_CODE_LENGTH} dígitos.`,
    ),
});

export type CompleteOrderPayload = z.infer<typeof completeOrderSchema>;
