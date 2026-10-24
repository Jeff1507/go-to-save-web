import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  getProfile,
  removeAvatar,
  updateAvatar,
  updateProfile,
} from "../../data/repositories/user-repository";
import { useToast } from "./use-toast";

export const userQueryKey = ["user"];

export function useUser() {
  const { data: user, ...rest } = useQuery({
    queryKey: userQueryKey,
    queryFn: getProfile,
    retry: false,
  });

  return { user, ...rest };
}

export function useRequireUser() {
  const { data: user } = useSuspenseQuery({
    queryKey: userQueryKey,
    queryFn: getProfile,
    retry: false,
  });

  return user;
}

function useUserMutation<TVariables>(
  mutationFn: (variables: TVariables) => Promise<unknown>,
  successMessage: string,
) {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKey });
      toast.show(successMessage);
    },
    onError: (error) => {
      toast.show(error.message, "error");
    },
  });
}

export const useUpdateAvatar = () =>
  useUserMutation(updateAvatar, "Foto atualizada com sucesso");

export const useRemoveAvatar = () =>
  useUserMutation<void>(removeAvatar, "Foto removida com sucesso");

export const useUpdateProfile = () =>
  useUserMutation(updateProfile, "Perfil atualizado com sucesso");
