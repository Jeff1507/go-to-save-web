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
import {
  createPickupWindowSchema,
  type CreatePickupWindowPayload,
} from "../payloads/pickup-window-payloads";
import { useCreatePickupWindow } from "../../core/hooks/use-pickup-windows";

interface CreatePickupWindowDialogProps {
  open: boolean;
  onClose: () => void;
}

const emptyValues: CreatePickupWindowPayload = { name: "", start: "", end: "" };

function CreatePickupWindowDialog({
  open,
  onClose,
}: CreatePickupWindowDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreatePickupWindowPayload>({
    resolver: zodResolver(createPickupWindowSchema),
    defaultValues: emptyValues,
  });

  const { mutate: create, isPending } = useCreatePickupWindow();

  useEffect(() => {
    if (open) reset(emptyValues);
  }, [open, reset]);

  const onSubmit = (data: CreatePickupWindowPayload) => {
    create(data, { onSuccess: onClose });
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
      <DialogTitle>Nova janela de retirada</DialogTitle>

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
            "Adicionar"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CreatePickupWindowDialog;
