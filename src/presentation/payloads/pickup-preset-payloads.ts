import z from "zod";

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

const nameSchema = z
  .string()
  .min(3, "O nome deve ter no mínimo 3 caracteres")
  .max(50, "O nome deve ter no máximo 50 caracteres");

const startSchema = z
  .string()
  .regex(timeRegex, "O horário da janela deve estar no formato HH:MM");

const endSchema = z
  .string()
  .regex(timeRegex, "O horário da janela deve estar no formato HH:MM");

export const createPickupPresetSchema = z.object({
  name: nameSchema,
  start: startSchema,
  end: endSchema,
});

export type CreatePickupPresetPayload = z.infer<
  typeof createPickupPresetSchema
>;

export const updatePickupPresetSchema = z.object({
  name: nameSchema,
  start: startSchema,
  end: endSchema,
});

export type UpdatePickupPresetPayload = z.infer<
  typeof updatePickupPresetSchema
>;
