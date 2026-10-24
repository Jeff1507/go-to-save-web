import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, CircularProgress, Stack, TextField } from "@mui/material";
import { useUpdateProfile } from "../../core/hooks/use-user";
import type { User } from "../../data/models/user";
import {
  DESCRIPTION_MAX_LENGTH,
  updateProfileSchema,
  type UpdateProfilePayload,
} from "../payloads/user-payloads";

function toFormValues(user: User): UpdateProfilePayload {
  return {
    name: user.name,
    description: user.description ?? null,
  };
}

function EditProfileForm({ user }: { user: User }) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateProfilePayload>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: toFormValues(user),
  });

  const description = useWatch({ control, name: "description" });
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const onSubmit = handleSubmit((values) => {
    updateProfile({
      name: values.name,
      description: values.description || null,
    });
  });

  return (
    <Stack component="form" spacing={2} onSubmit={onSubmit}>
      <TextField
        {...register("name")}
        label="Nome"
        autoComplete="organization"
        error={!!errors.name}
        helperText={errors.name?.message}
      />

      <TextField
        {...register("description")}
        label="Descrição (opcional)"
        multiline
        minRows={4}
        error={!!errors.description}
        helperText={
          errors.description?.message ??
          `${description?.length ?? 0}/${DESCRIPTION_MAX_LENGTH}`
        }
      />

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button type="submit" variant="contained" disabled={isPending}>
          {isPending ? (
            <CircularProgress size={22} color="inherit" />
          ) : (
            "Salvar alterações"
          )}
        </Button>
      </Box>
    </Stack>
  );
}

export default EditProfileForm;
