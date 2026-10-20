import { Chip } from "@mui/material";
import type { BagStatus } from "../../data/models/bag-status";

const config: Record<BagStatus, { label: string; color: "success" | "error" }> =
  {
    ACTIVE: { label: "Ativa", color: "success" },
    CLOSED: { label: "Fechada", color: "error" },
  };

function BagStatusChip({ status }: { status: BagStatus }) {
  const { label, color } = config[status];
  return <Chip size="small" label={label} color={color} />;
}

export default BagStatusChip;
