import { Link as RouterLink, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  CircularProgress,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useRequestPasswordReset } from "../../core/hooks/use-auth";
import {
  requestPasswordResetSchema,
  type RequestPasswordResetPayload,
} from "../payloads/auth-payloads";

function ForgotPasswordPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RequestPasswordResetPayload>({
    resolver: zodResolver(requestPasswordResetSchema),
    defaultValues: { email: "" },
  });

  const { mutate: request, isPending } = useRequestPasswordReset();

  const onSubmit = handleSubmit((data) => {
    request(data, {
      onSuccess: () =>
        navigate(`/reset-password?email=${encodeURIComponent(data.email)}`, {
          state: { codeSent: true },
        }),
    });
  });

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
        spacing={4}
        component={Paper}
        elevation={3}
        sx={{ width: { xs: "100%", sm: 400 }, p: 4 }}
      >
        <Stack spacing={1}>
          <Typography variant="h6" align="center">
            Solicitar alteração de senha
          </Typography>
          <Typography align="center" sx={{ color: "text.secondary" }}>
            Um código de 6 dígitos será enviado para o seu email.
          </Typography>
        </Stack>

        <Stack component="form" noValidate spacing={3} onSubmit={onSubmit}>
          <TextField
            {...register("email")}
            label="Email"
            type="email"
            autoComplete="email"
            autoFocus
            error={!!errors.email}
            helperText={errors.email?.message}
            disabled={isPending}
          />

          <Button
            type="submit"
            variant="contained"
            disabled={isPending}
            sx={{ height: 56 }}
          >
            {isPending ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              "Enviar"
            )}
          </Button>
        </Stack>

        <Typography variant="body2" align="center">
          <Link component={RouterLink} to="/login">
            Voltar para o login
          </Link>
        </Typography>
      </Stack>
    </Box>
  );
}

export default ForgotPasswordPage;
