import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./use-toast";
import {
  loginUser,
  logoutUser,
  requestEmailVerification,
  requestPasswordReset,
  resetPassword,
  signupUser,
  verifyEmail,
} from "../../data/repositories/auth-repository";
import { userQueryKey } from "./use-user";

function useAuthMutation<TVariables>(
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

export const useSignup = () =>
  useAuthMutation(signupUser, "Conta criada com sucesso");

export const useLogin = () => useAuthMutation(loginUser, "Bem vindo de volta");

export const useRequestPasswordReset = () =>
  useAuthMutation(requestPasswordReset, "Código enviado para o seu e-mail");

export const useResetPassword = () =>
  useAuthMutation(resetPassword, "Senha alterada com sucesso");

export const useRequestEmailVerification = () =>
  useAuthMutation(requestEmailVerification, "Código enviado para o seu e-mail");

export const useVerifyEmail = () =>
  useAuthMutation(verifyEmail, "E-mail verificado com sucesso");

export function useLogout() {
  const toast = useToast();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      toast.show("Desconectado com sucesso.");
    },
    onError: (error) => {
      toast.show(error.message, "error");
    },
  });
}
