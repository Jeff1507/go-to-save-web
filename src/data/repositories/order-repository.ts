import { api } from "../../core/lib/api";
import type { Order } from "../models/order";
import type { OrderStatus } from "../models/order-status";
import type { OrderSummary } from "../models/order-summary";

export async function listOrders(status: OrderStatus) {
  const orders = await api
    .get("orders", { searchParams: { status } })
    .json<OrderSummary[]>();

  return orders;
}

export function listPendingOrders() {
  return listOrders("PENDING");
}

const FINISHED_STATUSES: OrderStatus[] = ["COMPLETED", "CANCELLED", "NO_SHOW"];
const finishedAt = (order: OrderSummary) =>
  new Date(order.completedAt ?? order.createdAt).getTime();

export async function listFinishedOrders() {
  const lists = await Promise.all(
    FINISHED_STATUSES.map((status) => listOrders(status)),
  );

  return lists.flat().sort((a, b) => finishedAt(b) - finishedAt(a));
}

export async function getOrder(id: string) {
  const order = await api.get(`orders/${id}`).json<Order>();
  return order;
}

export async function completeOrder({
  id,
  confirmationCode,
}: {
  id: string;
  confirmationCode: string;
}) {
  await api.patch(`orders/${id}/complete`, { json: { confirmationCode } });
}

export async function cancelOrder(id: string) {
  await api.patch(`orders/${id}/cancel`);
}
