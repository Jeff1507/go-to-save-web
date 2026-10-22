import { Chip } from "@mui/material";
import type { OrderStatus } from "../../data/models/order-status";

const config: Record<
  OrderStatus,
  { label: string; color: "info" | "success" | "error" | "warning" }
> = {
  PENDING: { label: "Pendente", color: "info" },
  COMPLETED: { label: "Concluído", color: "success" },
  CANCELLED: { label: "Cancelado", color: "error" },
  NO_SHOW: { label: "Não compareceu", color: "warning" },
};

function OrderStatusChip({ status }: { status: OrderStatus }) {
  const { label, color } = config[status];
  return <Chip size="small" label={label} color={color} />;
}

export default OrderStatusChip;
