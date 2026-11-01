import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  cancelOrder,
  completeOrder,
  getOrder,
  listFinishedOrders,
  listPendingOrders,
} from "../../data/repositories/order-repository";
import { useToast } from "./use-toast";

export const ordersQueryKey = ["orders"];

export function usePendingOrders() {
  const { data: orders, ...rest } = useQuery({
    queryKey: [...ordersQueryKey, "pending"],
    queryFn: listPendingOrders,
    retry: false,
  });

  return { orders, ...rest };
}

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

function useOrderMutation<TVariables>(
  mutationFn: (variables: TVariables) => Promise<unknown>,
  successMessage: string,
) {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ordersQueryKey });
      toast.show(successMessage);
    },
    onError: (error) => {
      toast.show(error.message, "error");
    },
  });
}

export const useCompleteOrder = () =>
  useOrderMutation(completeOrder, "Pedido concluído com sucesso");

export const useCancelOrder = () =>
  useOrderMutation(cancelOrder, "Pedido cancelado com sucesso");
