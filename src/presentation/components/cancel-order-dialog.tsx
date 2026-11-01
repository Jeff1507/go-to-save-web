import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useCancelOrder } from "../../core/hooks/use-orders";
import type { OrderSummary } from "../../data/models/order-summary";
import { formatOrderId } from "../../utils/format-order-id";

interface CancelOrderDialogProps {
  open: boolean;
  order: OrderSummary | null;
  onClose: () => void;
}

function CancelOrderDialog({ open, order, onClose }: CancelOrderDialogProps) {
  const { mutate: cancel, isPending } = useCancelOrder();

  return (
    <Dialog
      open={open}
      onClose={isPending ? undefined : onClose}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>Cancelar pedido</DialogTitle>

      <DialogContent>
        <DialogContentText>
          Tem certeza que deseja cancelar o pedido{" "}
          {order ? <strong>{formatOrderId(order.id)}</strong> : null}
          {order ? ` de ${order.customer.fullname}` : ""}? Essa ação não pode
          ser desfeita.
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={isPending}>
          Voltar
        </Button>
        <Button
          color="error"
          variant="contained"
          disabled={isPending}
          onClick={() => order && cancel(order.id, { onSuccess: onClose })}
        >
          {isPending ? (
            <CircularProgress size={22} color="inherit" />
          ) : (
            "Cancelar pedido"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CancelOrderDialog;
