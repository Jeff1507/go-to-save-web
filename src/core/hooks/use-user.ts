import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  getProfile,
  getStats,
  removeAvatar,
  updateAddress,
  updateAvatar,
  updateEmail,
  updatePassword,
  updateProfile,
} from "../../data/repositories/user-repository";
import { useToast } from "./use-toast";

export const userQueryKey = ["user"];
export const statsQueryKey = ["stats"];

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

export function useStats() {
  const { data: stats, ...rest } = useQuery({
    queryKey: statsQueryKey,
    queryFn: getStats,
    retry: false,
  });

  return { stats, ...rest };
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

export const useUpdateAddress = () =>
  useUserMutation(updateAddress, "Endereço atualizado com sucesso");

export const useUpdateEmail = () =>
  useUserMutation(updateEmail, "Código enviado para o novo e-mail");

export function useUpdatePassword() {
  const toast = useToast();

  return useMutation({
    mutationFn: updatePassword,
    onSuccess: () => {
      toast.show(
        "Senha alterada com sucesso. Entre novamente com a nova senha.",
      );
    },
    onError: (error) => {
      toast.show(error.message, "error");
    },
  });
}
