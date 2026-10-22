import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { useOrder } from "../../core/hooks/use-orders";
import { formatCurrency } from "../../utils/format-currency";
import { formatOrderId } from "../../utils/format-order-id";
import { formatPickupWindow } from "../../utils/format-pickup-window";
import { resolveMediaUrl } from "../../utils/resolve-media-url";
import OrderStatusChip from "./order-status-chip";

interface OrderDetailsDialogProps {
  open: boolean;
  orderId: string | null;
  onClose: () => void;
}

const dateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Stack spacing={0.5}>
      <Typography variant="caption" sx={{ color: "text.secondary" }}>
        {label}
      </Typography>
      {children}
    </Stack>
  );
}

function OrderDetailsDialog({
  open,
  orderId,
  onClose,
}: OrderDetailsDialogProps) {
  const { order, isLoading, isError, refetch } = useOrder(orderId);
  const pickup = order ? formatPickupWindow(order.pickupWindow) : null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      scroll="paper"
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <span>
          {order ? `Pedido ${formatOrderId(order.id)}` : "Detalhes do pedido"}
        </span>
        {order && <OrderStatusChip status={order.status} />}
      </DialogTitle>

      <DialogContent dividers>
        {isLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress />
          </Box>
        )}

        {isError && (
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={() => refetch()}>
                Tentar novamente
              </Button>
            }
          >
            Não foi possível carregar os detalhes do pedido.
          </Alert>
        )}

        {order && pickup && (
          <Stack spacing={3}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
              <Avatar
                src={resolveMediaUrl(order.customer.avatarUrl) ?? undefined}
              >
                {order.customer.fullname.charAt(0)}
              </Avatar>
              <Stack>
                <Typography sx={{ fontWeight: 600 }}>
                  {order.customer.fullname}
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  Cliente
                </Typography>
              </Stack>
            </Stack>

            <Box
              sx={{
                display: "grid",
                gap: 3,
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              }}
            >
              <Field label="Total">
                <Typography>{formatCurrency(order.totalPrice)}</Typography>
              </Field>

              <Field label="Retirada">
                <Typography>{pickup.day}</Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {pickup.range}
                </Typography>
              </Field>

              <Field label="Pedido feito em">
                <Typography>
                  {dateTimeFormatter.format(new Date(order.createdAt))}
                </Typography>
              </Field>

              {order.completedAt && (
                <Field label="Finalizado em">
                  <Typography>
                    {dateTimeFormatter.format(new Date(order.completedAt))}
                  </Typography>
                </Field>
              )}
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Sacolas ({order.bags.length})
              </Typography>

              <Stack divider={<Divider />}>
                {order.bags.map((bag) => (
                  <Stack key={bag.id} spacing={0.5} sx={{ py: 1.5 }}>
                    <Stack
                      direction="row"
                      spacing={2}
                      sx={{ justifyContent: "space-between" }}
                    >
                      <Typography sx={{ fontWeight: 500 }}>
                        {bag.quantity}× {bag.title}
                      </Typography>
                      <Typography sx={{ whiteSpace: "nowrap" }}>
                        {formatCurrency(bag.unitPrice * bag.quantity)}
                      </Typography>
                    </Stack>

                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary" }}
                    >
                      {formatCurrency(bag.unitPrice)} cada
                    </Typography>

                    {bag.items.length > 0 && (
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        {bag.items
                          .map((item) => `${item.quantity}× ${item.name}`)
                          .join(", ")}
                      </Typography>
                    )}
                  </Stack>
                ))}
              </Stack>
            </Box>
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>Fechar</Button>
      </DialogActions>
    </Dialog>
  );
}

export default OrderDetailsDialog;
