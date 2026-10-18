import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPickupPreset,
  deletePickupPreset,
  listPickupPresets,
  updatePickupPreset,
} from "../../data/repositories/pickup-preset-repository";
import { useToast } from "./use-toast";

export const pickupPresetsQueryKey = ["pickup-presets"];

export function usePickupPresets() {
  const { data: presets, ...rest } = useQuery({
    queryKey: pickupPresetsQueryKey,
    queryFn: listPickupPresets,
    retry: false,
  });

  return { presets, ...rest };
}

function usePickupPresetMutation<TVariables>(
  mutationFn: (variables: TVariables) => Promise<unknown>,
  successMessage: string,
) {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pickupPresetsQueryKey });
      toast.show(successMessage);
    },
    onError: (error) => {
      toast.show(error.message, "error");
    },
  });
}

export const useCreatePickupPreset = () =>
  usePickupPresetMutation(
    createPickupPreset,
    "Janela de retirada criada com sucesso",
  );

export const useUpdatePickupPreset = () =>
  usePickupPresetMutation(
    updatePickupPreset,
    "Janela de retirada atualizada com sucesso",
  );

export const useDeletePickupPreset = () =>
  usePickupPresetMutation(
    deletePickupPreset,
    "Janela de retirada removida com sucesso",
  );
