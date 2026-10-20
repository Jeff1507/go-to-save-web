import type { BagStatus } from "./bag-status";
import type { PickupWindow } from "./pickup-window";

export type BagItem = {
  id: string;
  name: string;
  imageUrl: string | null;
  quantity: number;
};

export type Bag = {
  id: string;
  title: string;
  description: string | null;
  stock: number;
  discount: number;
  originalPrice: number;
  finalPrice: number;
  status: BagStatus;
  createdAt: string;
  updatedAt: string;
  pickupWindow: PickupWindow;
  items: BagItem[];
};
