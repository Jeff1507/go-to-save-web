import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBag,
  getBag,
  listBags,
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

export function useCreateBag() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: createBag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bagsQueryKey });
      toast.show("Sacola criada com sucesso");
    },
    onError: (error) => {
      toast.show(error.message, "error");
    },
  });
}
