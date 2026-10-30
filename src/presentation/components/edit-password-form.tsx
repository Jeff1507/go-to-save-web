import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  TextField,
} from "@mui/material";
import { useUpdatePassword, userQueryKey } from "../../core/hooks/use-user";
import {
  updatePasswordSchema,
  type UpdatePasswordPayload,
} from "../payloads/user-payloads";

function EditPasswordForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdatePasswordPayload>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: { password: "", newPassword: "", confirmNewPassword: "" },
  });

  const { mutate: updatePassword, isPending } = useUpdatePassword();

  const onSubmit = handleSubmit((values) => {
    const { confirmNewPassword, ...payload } = values;

    updatePassword(payload, {
      onSuccess: () => {
        navigate("/login", { replace: true });
        queryClient.removeQueries({ queryKey: userQueryKey });
      },
    });
  });

  return (
    <Stack component="form" noValidate spacing={2} onSubmit={onSubmit}>
      <TextField
        {...register("password")}
        label="Senha atual"
        type="password"
        autoComplete="current-password"
        error={!!errors.password}
        helperText={errors.password?.message}
      />
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

      <Alert severity="warning">
        Ao alterar a senha, todas as sessões serão encerradas, inclusive a deste
        dispositivo e as dos outros em que a sua conta está aberta. Você
        precisará entrar novamente com a nova senha.
      </Alert>

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button type="submit" variant="contained" disabled={isPending}>
          {isPending ? (
            <CircularProgress size={22} color="inherit" />
          ) : (
            "Alterar senha"
          )}
        </Button>
      </Box>
    </Stack>
  );
}

export default EditPasswordForm;
