import z from "zod";
import { TIME_REGEX } from "../../utils/build-pickup-window";
import {
  MAX_PICKUP_MINUTES,
  MIN_PICKUP_MINUTES,
  isValidPickupDuration,
} from "../../utils/pickup-duration";
export const MIN_DISCOUNT = 30;
export const MAX_DISCOUNT = 90;

export const MONEY_REGEX = /^\d+([.,]\d{1,2})?$/;
export const moneyToCents = (value: string) =>
  Math.round(Number(value.trim().replace(",", ".")) * 100);

const integer = (message: string) => z.string().trim().regex(/^\d+$/, message);

const infoShape = {
  title: z
    .string()
    .trim()
    .min(3, "O título deve ter no mínimo 3 caracteres.")
    .max(50, "O título deve ter no máximo 50 caracteres."),
  description: z
    .string()
    .trim()
    .max(255, "A descrição deve ter no máximo 255 caracteres."),
  originalPrice: z
    .string()
    .trim()
    .regex(MONEY_REGEX, "Informe um valor válido, ex.: 20,00.")
    .refine((v) => moneyToCents(v) >= 1, "O valor deve ser maior que zero."),
  discount: integer(
    `Informe um número inteiro (de ${MIN_DISCOUNT} a ${MAX_DISCOUNT}).`,
  ).refine(
    (v) => Number(v) >= MIN_DISCOUNT && Number(v) <= MAX_DISCOUNT,
    `O desconto deve estar entre ${MIN_DISCOUNT}% e ${MAX_DISCOUNT}%.`,
  ),
};

const stockShape = {
  stock: integer("Informe um número inteiro.").refine(
    (v) => Number(v) >= 1,
    "O estoque deve ser de no mínimo 1.",
  ),
};

const itemsShape = {
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().min(1),
      }),
    )
    .min(1, "Selecione ao menos um produto."),
};

const pickupShape = {
  customPickup: z.boolean(),
  presetId: z.string(),
  customStart: z.string(),
  customEnd: z.string(),
};

type PickupValues = {
  customPickup: boolean;
  presetId: string;
  customStart: string;
  customEnd: string;
};

type IssueSink = {
  addIssue: (issue: {
    code: "custom";
    path: string[];
    message: string;
  }) => void;
};

function addPickupIssues(v: PickupValues, ctx: IssueSink) {
  const add = (path: string, message: string) =>
    ctx.addIssue({ code: "custom", path: [path], message });

  if (!v.customPickup) {
    if (!v.presetId) add("presetId", "Escolha uma janela de retirada.");
    return;
  }

  const startOk = TIME_REGEX.test(v.customStart);
  const endOk = TIME_REGEX.test(v.customEnd);

  if (!startOk) add("customStart", "Informe o horário de início.");
  if (!endOk) add("customEnd", "Informe o horário de fim.");

  if (startOk && endOk && !isValidPickupDuration(v.customStart, v.customEnd)) {
    add(
      "customEnd",
      `A janela deve ter entre ${MIN_PICKUP_MINUTES} minutos e ${MAX_PICKUP_MINUTES / 60} horas.`,
    );
  }
}

export const createBagSchema = z
  .object({ ...infoShape, ...stockShape, ...itemsShape, ...pickupShape })
  .superRefine((v, ctx) => addPickupIssues(v, ctx));

export const updateBagSchema = z
  .object({ ...infoShape, ...itemsShape, ...pickupShape })
  .superRefine((v, ctx) => addPickupIssues(v, ctx));

export type CreateBagPayload = z.infer<typeof createBagSchema>;

export type UpdateBagPayload = z.infer<typeof updateBagSchema>;

export const updateBagStockSchema = z.object({
  stock: z
    .string()
    .trim()
    .regex(/^\d+$/, "Informe um número inteiro maior ou igual a zero."),
});

export type UpdateBagStockPayload = z.infer<typeof updateBagStockSchema>;
