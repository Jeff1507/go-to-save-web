import type { Customer } from "./order-customer";
import type { OrderStatus } from "./order-status";
import type { PickupWindow } from "./pickup-window";

export type OrderSummary = {
  id: string;
  status: OrderStatus;
  totalPrice: number;
  createdAt: string;
  completedAt: string | null;
  pickupWindow: PickupWindow;
  customer: Customer;
};
