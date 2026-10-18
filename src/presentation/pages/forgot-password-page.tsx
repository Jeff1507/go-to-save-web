import { useNavigate } from "react-router";
import { useToast } from "../../core/hooks/use-toast";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  requestPasswordResetSchema,
  type RequestPasswordResetPayload,
} from "../payloads/auth-payloads";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { requestPasswordReset } from "../../data/repositories/auth-repository";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

function ForgotPasswordPage() {
  const toast = useToast();
  const navigate = useNavigate();
  const [emailUri, setEmailUri] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RequestPasswordResetPayload>({
    resolver: zodResolver(requestPasswordResetSchema),
    defaultValues: {
      email: "",
    },
  });

  const { mutate: request, isPending } = useMutation({
    mutationFn: requestPasswordReset,
    onSuccess: () => {
      toast.show("Código enviado com sucesso");
      navigate(`/reset-password?email=${encodeURIComponent(emailUri)}`);
    },
    onError: (error) => {
      toast.show(error.message, "error");
    },
  });

  const onSubmit = (data: RequestPasswordResetPayload) => {
    setEmailUri(data.email);
    request(data);
  };

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
        sx={{ width: 400, p: 4 }}
      >
        <Stack>
          <Typography variant="h6" align="center" gutterBottom>
            Solicitar alteração de senha
          </Typography>
          <Typography align="center" sx={{ color: "text.secondary" }}>
            Um código de 6 dígitos será enviado para o seu email.
          </Typography>
        </Stack>

        <Stack spacing={2}>
          <TextField
            {...register("email")}
            label="Email"
            autoFocus
            error={!!errors.email}
            helperText={errors.email?.message}
            disabled={isPending}
          />
        </Stack>

        <Button
          variant="contained"
          onClick={handleSubmit(onSubmit)}
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
    </Box>
  );
}

export default ForgotPasswordPage;
