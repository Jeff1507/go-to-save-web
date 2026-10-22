import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  closeBag,
  createBag,
  getBag,
  listBags,
  updateBag,
  updateBagStock,
} from "../../data/repositories/bag-repository";
import { useToast } from "./use-toast";

export const bagsQueryKey = ["bags"];

export function useBags() {
  const { data: bags, ...rest } = useQuery({
    queryKey: bagsQueryKey,
    queryFn: listBags,
    retry: false,
  });

  return { bags, ...rest };
}

export function useBag(id: string | null) {
  const { data: bag, ...rest } = useQuery({
    queryKey: [...bagsQueryKey, id],
    queryFn: () => getBag(id!),
    enabled: !!id,
    retry: false,
  });

  return { bag, ...rest };
}

function useBagMutation<TVariables>(
  mutationFn: (variables: TVariables) => Promise<unknown>,
  successMessage: string,
) {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bagsQueryKey });
      toast.show(successMessage);
    },
    onError: (error) => {
      toast.show(error.message, "error");
    },
  });
}

export const useCreateBag = () =>
  useBagMutation(createBag, "Sacola criada com sucesso");

export const useUpdateBag = () =>
  useBagMutation(updateBag, "Sacola atualizada com sucesso");

export const useUpdateBagStock = () =>
  useBagMutation(updateBagStock, "Estoque atualizado com sucesso");

export const useCloseBag = () =>
  useBagMutation(closeBag, "Sacola fechada com sucesso");
