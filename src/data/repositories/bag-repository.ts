import { api } from "../../core/lib/api";
import type { Bag } from "../models/bag";
import type { BagSummary } from "../models/bag-summary";

export async function listBags() {
  const bags = await api.get("bags").json<BagSummary[]>();
  return bags;
}

export async function getBag(id: string) {
  const bag = await api.get(`bags/${id}`).json<Bag>();
  return bag;
}

export async function createBag(data: {
  title: string;
  description: string | null;
  stock: number;
  originalPrice: number;
  discount: number;
  pickupWindow: {
    start: string;
    end: string;
  };
  items: {
    productId: string;
    quantity: number;
  }[];
}) {
  await api.post("bags", { json: data });
}

export async function updateBag({
  id,
  ...data
}: {
  id: string;
  title: string;
  description: string | null;
  originalPrice: number;
  discount: number;
  pickupWindow: {
    start: string;
    end: string;
  };
  items: {
    productId: string;
    quantity: number;
  }[];
}) {
  await api.put(`bags/${id}`, { json: data });
}

export async function updateBagStock({
  id,
  delta,
}: {
  id: string;
  delta: number;
}) {
  await api.patch(`bags/${id}/stock`, { json: { delta } });
}

export async function closeBag(id: string) {
  await api.patch(`bags/${id}/close`);
}
