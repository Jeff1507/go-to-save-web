import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProduct,
  deleteProduct,
  listProducts,
  updateProduct,
} from "../../data/repositories/product-repository";
import { useToast } from "./use-toast";

export const productsQueryKey = ["products"];

export function useProducts() {
  const { data: products, ...rest } = useQuery({
    queryKey: productsQueryKey,
    queryFn: listProducts,
    retry: false,
  });

  return { products, ...rest };
}

function useProductMutation<TVariables>(
  mutationFn: (variables: TVariables) => Promise<unknown>,
  successMessage: string,
) {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productsQueryKey });
      toast.show(successMessage);
    },
    onError: (error) => {
      toast.show(error.message, "error");
    },
  });
}

export const useCreateProduct = () =>
  useProductMutation(createProduct, "Produto criado com sucesso");

export const useUpdateProduct = () =>
  useProductMutation(updateProduct, "Produto atualizado com sucesso");

export const useDeleteProduct = () =>
  useProductMutation(deleteProduct, "Produto removido com sucesso");
