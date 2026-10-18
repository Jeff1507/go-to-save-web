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
import type { PickupWindow } from "../../data/models/pickup-window";
import {
  updatePickupWindowSchema,
  type UpdatePickupWindowPayload,
} from "../payloads/pickup-window-payloads";
import { useUpdatePickupWindow } from "../../core/hooks/use-pickup-windows";

interface EditPickupWindowDialogProps {
  open: boolean;
  pickupWindow: PickupWindow | null;
  onClose: () => void;
}

function toFormValues(
  pickupWindow: PickupWindow | null,
): UpdatePickupWindowPayload {
  return {
    name: pickupWindow?.name ?? "",
    start: pickupWindow?.start ?? "",
    end: pickupWindow?.end ?? "",
  };
}

function EditPickupWindowDialog({
  open,
  pickupWindow,
  onClose,
}: EditPickupWindowDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdatePickupWindowPayload>({
    resolver: zodResolver(updatePickupWindowSchema),
    defaultValues: toFormValues(pickupWindow),
  });

  const { mutate: update, isPending } = useUpdatePickupWindow();

  useEffect(() => {
    if (open) reset(toFormValues(pickupWindow));
  }, [open, pickupWindow, reset]);

  const onSubmit = (data: UpdatePickupWindowPayload) => {
    if (!pickupWindow) return;
    update({ id: pickupWindow.id, ...data }, { onSuccess: onClose });
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

export default EditPickupWindowDialog;
