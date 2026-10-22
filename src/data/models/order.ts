import type { BagItem } from "./bag";
import type { Customer } from "./order-customer";
import type { OrderStatus } from "./order-status";
import type { PickupWindow } from "./pickup-window";

export type OrderBag = {
  id: string;
  title: string;
  quantity: number;
  unitPrice: number;
  items: BagItem[];
};

export type Order = {
  id: string;
  status: OrderStatus;
  totalPrice: number;
  createdAt: string;
  completedAt: string | null;
  pickupWindow: PickupWindow;
  customer: Customer;
  bags: OrderBag[];
};
