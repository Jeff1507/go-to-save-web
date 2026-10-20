import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { ImageOutlined } from "@mui/icons-material";
import { useBag } from "../../core/hooks/use-bags";
import { formatCurrency } from "../../utils/format-currency";
import { formatPickupWindow } from "../../utils/format-pickup-window";
import { resolveMediaUrl } from "../../utils/resolve-media-url";
import BagStatusChip from "./bag-status-chip";

interface BagDetailsDialogProps {
  open: boolean;
  bagId: string | null;
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

function BagDetailsDialog({ open, bagId, onClose }: BagDetailsDialogProps) {
  const { bag, isLoading, isError, refetch } = useBag(bagId);
  const pickup = bag ? formatPickupWindow(bag.pickupWindow) : null;

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
        <span>{bag?.title ?? "Detalhes da sacola"}</span>
        {bag && <BagStatusChip status={bag.status} />}
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
            Não foi possível carregar os detalhes da sacola.
          </Alert>
        )}

        {bag && pickup && (
          <Stack spacing={3}>
            {bag.description && (
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {bag.description}
              </Typography>
            )}

            <Box
              sx={{
                display: "grid",
                gap: 3,
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              }}
            >
              <Field label="Preço">
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ alignItems: "center", flexWrap: "wrap", rowGap: 0.5 }}
                >
                  <Typography>{formatCurrency(bag.finalPrice)}</Typography>
                  {bag.discount > 0 && (
                    <>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.secondary",
                          textDecoration: "line-through",
                        }}
                      >
                        {formatCurrency(bag.originalPrice)}
                      </Typography>
                      <Chip
                        size="small"
                        color="success"
                        variant="outlined"
                        label={`-${bag.discount}%`}
                      />
                    </>
                  )}
                </Stack>
              </Field>

              <Field label="Estoque">
                <Typography
                  sx={{ color: bag.stock === 0 ? "text.secondary" : undefined }}
                >
                  {bag.stock === 0
                    ? "Esgotada"
                    : `${bag.stock} ${bag.stock === 1 ? "unidade" : "unidades"}`}
                </Typography>
              </Field>

              <Field label="Retirada">
                <Typography>{pickup.day}</Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {pickup.range}
                </Typography>
                {pickup.endsOn && (
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    Termina em {pickup.endsOn}
                  </Typography>
                )}
              </Field>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Itens da sacola ({bag.items.length})
              </Typography>

              <Stack divider={<Divider />}>
                {bag.items.map((item) => (
                  <Stack
                    key={item.id}
                    direction="row"
                    spacing={2}
                    sx={{ alignItems: "center", py: 1 }}
                  >
                    <Avatar
                      variant="rounded"
                      src={resolveMediaUrl(item.imageUrl) ?? undefined}
                    >
                      <ImageOutlined />
                    </Avatar>
                    <Typography noWrap sx={{ flex: 1, minWidth: 0 }}>
                      {item.name}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >{`x${item.quantity}`}</Typography>
                  </Stack>
                ))}
              </Stack>
            </Box>

            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Criada em {dateTimeFormatter.format(new Date(bag.createdAt))} ·
              Atualizada em {dateTimeFormatter.format(new Date(bag.updatedAt))}
            </Typography>
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>Fechar</Button>
      </DialogActions>
    </Dialog>
  );
}

export default BagDetailsDialog;
