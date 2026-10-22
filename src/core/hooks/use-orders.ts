import { useQuery } from "@tanstack/react-query";
import {
  getOrder,
  listFinishedOrders,
} from "../../data/repositories/order-repository";

export const ordersQueryKey = ["orders"];

export function useFinishedOrders() {
  const { data: orders, ...rest } = useQuery({
    queryKey: [...ordersQueryKey, "finished"],
    queryFn: listFinishedOrders,
    retry: false,
  });

  return { orders, ...rest };
}

export function useOrder(id: string | null) {
  const { data: order, ...rest } = useQuery({
    queryKey: [...ordersQueryKey, "detail", id],
    queryFn: () => getOrder(id!),
    enabled: !!id,
    retry: false,
  });

  return { order, ...rest };
}
