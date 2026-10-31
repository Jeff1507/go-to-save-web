import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { useToast } from "./use-toast";
import {
  loginUser,
  logoutUserFromAll,
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
  { refreshUser = false }: { refreshUser?: boolean } = {},
) {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      if (refreshUser) {
        queryClient.invalidateQueries({ queryKey: userQueryKey });
      }
      toast.show(successMessage);
    },
    onError: (error) => {
      toast.show(error.message, "error");
    },
  });
}

function useSessionEndMutation<TVariables>(
  mutationFn: (variables: TVariables) => Promise<unknown>,
  successMessage: string,
) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      navigate("/login", { replace: true });
      queryClient.removeQueries({ queryKey: userQueryKey });
      toast.show(successMessage);
    },
    onError: (error) => {
      toast.show(error.message, "error");
    },
  });
}

export const useSignup = () =>
  useAuthMutation(signupUser, "Conta criada com sucesso", {
    refreshUser: true,
  });

export const useLogin = () =>
  useAuthMutation(loginUser, "Bem vindo de volta", { refreshUser: true });

export const useRequestPasswordReset = () =>
  useAuthMutation(requestPasswordReset, "Código enviado para o seu e-mail");

export const useResetPassword = () =>
  useAuthMutation(resetPassword, "Senha alterada com sucesso");

export const useRequestEmailVerification = () =>
  useAuthMutation(requestEmailVerification, "Código enviado para o seu e-mail");

export const useVerifyEmail = () =>
  useAuthMutation(verifyEmail, "E-mail verificado com sucesso", {
    refreshUser: true,
  });

export const useLogout = () =>
  useSessionEndMutation<void>(logoutUser, "Desconectado com sucesso.");

export const useLogoutAll = () =>
  useSessionEndMutation<void>(
    logoutUserFromAll,
    "Todas as sessões foram encerradas.",
  );
