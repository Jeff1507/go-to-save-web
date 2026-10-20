import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import type { PickupPreset } from "../../data/models/pickup-preset";
import {
  updatePickupPresetSchema,
  type UpdatePickupPresetPayload,
} from "../payloads/pickup-preset-payloads";
import { useUpdatePickupPreset } from "../../core/hooks/use-pickup-presets";

interface EditPickupPresetFormProps {
  open: boolean;
  preset: PickupPreset | null;
  onClose: () => void;
}

function toFormValues(preset: PickupPreset | null): UpdatePickupPresetPayload {
  return {
    name: preset?.name ?? "",
    start: preset?.start ?? "",
    end: preset?.end ?? "",
  };
}

function EditPickupPresetForm({
  open,
  preset,
  onClose,
}: EditPickupPresetFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdatePickupPresetPayload>({
    resolver: zodResolver(updatePickupPresetSchema),
    defaultValues: toFormValues(preset),
  });

  const { mutate: update, isPending } = useUpdatePickupPreset();

  useEffect(() => {
    if (open) reset(toFormValues(preset));
  }, [open, preset, reset]);

  const onSubmit = (data: UpdatePickupPresetPayload) => {
    if (!preset) return;
    update({ id: preset.id, ...data }, { onSuccess: onClose });
  };

  return (
    <Dialog
      open={open}
      onClose={isPending ? undefined : onClose}
      fullWidth
      maxWidth="xs"
      slotProps={{
        paper: {
          component: "form",
          onSubmit: handleSubmit(onSubmit),
        },
      }}
    >
      <DialogTitle>Editar janela de retirada</DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <TextField
            {...register("name")}
            label="Nome"
            autoFocus
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          <Stack direction="row" spacing={2}>
            <TextField
              {...register("start")}
              label="Início"
              type="time"
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
              error={!!errors.start}
              helperText={errors.start?.message}
            />
            <TextField
              {...register("end")}
              label="Fim"
              type="time"
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
              error={!!errors.end}
              helperText={errors.end?.message}
            />
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={isPending}>
          Cancelar
        </Button>
        <Button type="submit" variant="contained" disabled={isPending}>
          {isPending ? (
            <CircularProgress size={22} color="inherit" />
          ) : (
            "Salvar"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditPickupPresetForm;
