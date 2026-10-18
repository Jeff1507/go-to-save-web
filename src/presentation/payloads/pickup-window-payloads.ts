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

export const createPickupWindowSchema = z.object({
  name: nameSchema,
  start: startSchema,
  end: endSchema,
});

export type CreatePickupWindowPayload = z.infer<
  typeof createPickupWindowSchema
>;

export const updatePickupWindowSchema = z.object({
  name: nameSchema,
  start: startSchema,
  end: endSchema,
});

export type UpdatePickupWindowPayload = z.infer<
  typeof updatePickupWindowSchema
>;
