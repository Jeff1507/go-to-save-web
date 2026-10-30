import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  useRequestPasswordReset,
  useResetPassword,
} from "../../core/hooks/use-auth";
import {
  resetPasswordSchema,
  type ResetPasswordPayload,
} from "../payloads/auth-payloads";

const RESEND_COOLDOWN_SECONDS = 60;

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const location = useLocation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordPayload>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: email ?? "",
      code: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const { mutate: resetPassword, isPending } = useResetPassword();
  const { mutate: resend, isPending: isResending } = useRequestPasswordReset();

  const codeJustSent = (location.state as { codeSent?: boolean } | null)
    ?.codeSent;
  const [resendCooldown, setResendCooldown] = useState(
    codeJustSent ? RESEND_COOLDOWN_SECONDS : 0,
  );

  useEffect(() => {
    if (resendCooldown === 0) return;

    const timer = setTimeout(() => setResendCooldown((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  if (!email)
    return (
      <Box
        sx={{
          minHeight: "100vh",
          px: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Stack spacing={2} sx={{ alignItems: "center" }}>
          <Typography>Nenhum email informado.</Typography>
          <Button onClick={() => navigate("/forgot-password")}>
            Solicitar código
          </Button>
        </Stack>
      </Box>
    );

  const onSubmit = handleSubmit((data) => {
    const { confirmNewPassword, ...payload } = data;
    resetPassword(payload, { onSuccess: () => navigate("/login") });
  });

  const onResend = () =>
    resend(
      { email },
      { onSuccess: () => setResendCooldown(RESEND_COOLDOWN_SECONDS) },
    );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Stack
        component={Paper}
        elevation={3}
        spacing={4}
        sx={{ width: { xs: "100%", sm: 400 }, p: 4 }}
      >
        <Stack spacing={1}>
          <Typography variant="h6" align="center">
            Redefinir senha
          </Typography>
          <Typography align="center" sx={{ color: "text.secondary" }}>
            Enviamos um código de 6 dígitos para <strong>{email}</strong>.
            Digite-o abaixo e escolha uma nova senha.
          </Typography>
        </Stack>

        <Stack component="form" noValidate spacing={3} onSubmit={onSubmit}>
          <Stack spacing={2}>
            <Stack spacing={0.5}>
              <TextField
                {...register("code")}
                label="Código"
                autoComplete="one-time-code"
                autoFocus
                error={!!errors.code}
                helperText={errors.code?.message}
                slotProps={{
                  htmlInput: { inputMode: "numeric", maxLength: 6 },
                }}
              />
              <Stack
                direction="row"
                spacing={1}
                sx={{ alignItems: "center", justifyContent: "space-between" }}
              >
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Não recebeu o código?
                </Typography>
                <Button
                  size="small"
                  onClick={onResend}
                  disabled={isResending || resendCooldown > 0}
                >
                  {resendCooldown > 0
                    ? `Reenviar em ${resendCooldown}s`
                    : "Reenviar"}
                </Button>
              </Stack>
            </Stack>

            <TextField
              {...register("newPassword")}
              label="Nova senha"
              type="password"
              autoComplete="new-password"
              error={!!errors.newPassword}
              helperText={errors.newPassword?.message}
            />
            <TextField
              {...register("confirmNewPassword")}
              label="Confirmar nova senha"
              type="password"
              autoComplete="new-password"
              error={!!errors.confirmNewPassword}
              helperText={errors.confirmNewPassword?.message}
            />
          </Stack>

          <Button
            type="submit"
            variant="contained"
            disabled={isPending}
            sx={{ height: 56 }}
          >
            {isPending ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              "Alterar senha"
            )}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

export default ResetPasswordPage;
