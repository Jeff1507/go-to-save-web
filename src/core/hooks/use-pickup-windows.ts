import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPickupWindow,
  deletePickupWindow,
  listPickupWindows,
  updatePickupWindow,
} from "../../data/repositories/pickup-window-repository";
import { useToast } from "./use-toast";

export const pickupWindowsQueryKey = ["pickup-windows"];

export function usePickupWindows() {
  const { data: pickupWindows, ...rest } = useQuery({
    queryKey: pickupWindowsQueryKey,
    queryFn: listPickupWindows,
    retry: false,
  });

  return { pickupWindows, ...rest };
}

function usePickupWindowMutation<TVariables>(
  mutationFn: (variables: TVariables) => Promise<unknown>,
  successMessage: string,
) {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pickupWindowsQueryKey });
      toast.show(successMessage);
    },
    onError: (error) => {
      toast.show(error.message, "error");
    },
  });
}

export const useCreatePickupWindow = () =>
  usePickupWindowMutation(
    createPickupWindow,
    "Janela de retirada criada com sucesso",
  );

export const useUpdatePickupWindow = () =>
  usePickupWindowMutation(
    updatePickupWindow,
    "Janela de retirada atualizada com sucesso",
  );

export const useDeletePickupWindow = () =>
  usePickupWindowMutation(
    deletePickupWindow,
    "Janela de retirada removida com sucesso",
  );
