import { useMemo } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useUpdateEmail } from "../../core/hooks/use-user";
import type { User } from "../../data/models/user";
import {
  createUpdateEmailSchema,
  type UpdateEmailPayload,
} from "../payloads/user-payloads";

function EditEmailForm({ user }: { user: User }) {
  const navigate = useNavigate();

  const schema = useMemo(
    () => createUpdateEmailSchema(user.email),
    [user.email],
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateEmailPayload>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const { mutate: updateEmail, isPending } = useUpdateEmail();

  const onSubmit = handleSubmit((values) => {
    updateEmail(values.email, {
      onSuccess: () =>
        navigate(`/verify-email?email=${encodeURIComponent(values.email)}`, {
          state: { codeSent: true },
        }),
    });
  });

  return (
    <Stack component="form" noValidate spacing={2} onSubmit={onSubmit}>
      <Stack spacing={0.25}>
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          E-mail atual
        </Typography>
        <Typography variant="body2">{user.email}</Typography>
      </Stack>

      <TextField
        {...register("email")}
        label="Novo e-mail"
        type="email"
        autoComplete="email"
        error={!!errors.email}
        helperText={
          errors.email?.message ??
          "Enviaremos um código de verificação para este e-mail."
        }
      />

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button type="submit" variant="contained" disabled={isPending}>
          {isPending ? (
            <CircularProgress size={22} color="inherit" />
          ) : (
            "Alterar e-mail"
          )}
        </Button>
      </Box>
    </Stack>
  );
}

export default EditEmailForm;
