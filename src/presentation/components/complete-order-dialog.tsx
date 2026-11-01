import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { useCompleteOrder } from "../../core/hooks/use-orders";
import type { OrderSummary } from "../../data/models/order-summary";
import { formatOrderId } from "../../utils/format-order-id";
import {
  CONFIRMATION_CODE_LENGTH,
  completeOrderSchema,
  type CompleteOrderPayload,
} from "../payloads/order-payloads";

interface CompleteOrderDialogProps {
  open: boolean;
  order: OrderSummary | null;
  onClose: () => void;
}

function CompleteOrderDialog({
  open,
  order,
  onClose,
}: CompleteOrderDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CompleteOrderPayload>({
    resolver: zodResolver(completeOrderSchema),
    defaultValues: { confirmationCode: "" },
  });

  const { mutate: complete, isPending } = useCompleteOrder();

  useEffect(() => {
    if (open) reset({ confirmationCode: "" });
  }, [open, order, reset]);

  const onSubmit = handleSubmit((values) => {
    if (!order) return;

    complete(
      { id: order.id, confirmationCode: values.confirmationCode },
      { onSuccess: onClose },
    );
  });

  return (
    <Dialog
      open={open}
      onClose={isPending ? undefined : onClose}
      fullWidth
      maxWidth="xs"
      slotProps={{ paper: { component: "form", onSubmit } }}
    >
      <DialogTitle>Completar pedido</DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ pt: 0.5 }}>
          <DialogContentText>
            Peça ao cliente{order ? ` ${order.customer.fullname}` : ""} o código
            de {CONFIRMATION_CODE_LENGTH} dígitos do pedido{" "}
            {order ? <strong>{formatOrderId(order.id)}</strong> : null} e
            digite-o abaixo para confirmar a retirada.
          </DialogContentText>

          <TextField
            {...register("confirmationCode")}
            label="Código de confirmação"
            placeholder="****"
            autoFocus
            autoComplete="off"
            error={!!errors.confirmationCode}
            helperText={errors.confirmationCode?.message}
            slotProps={{
              htmlInput: {
                inputMode: "numeric",
                maxLength: CONFIRMATION_CODE_LENGTH,
              },
            }}
          />
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
            "Completar"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CompleteOrderDialog;
