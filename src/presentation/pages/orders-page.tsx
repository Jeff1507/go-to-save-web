import { useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { VisibilityOutlined } from "@mui/icons-material";
import { useFinishedOrders } from "../../core/hooks/use-orders";
import type { OrderStatus } from "../../data/models/order-status";
import { formatCurrency } from "../../utils/format-currency";
import { formatOrderId } from "../../utils/format-order-id";
import { formatPickupWindow } from "../../utils/format-pickup-window";
import { resolveMediaUrl } from "../../utils/resolve-media-url";
import AppLayout from "../components/app-layout";
import OrderDetailsDialog from "../components/order-details-dialog";
import OrderStatusChip from "../components/order-status-chip";

const ROWS_PER_PAGE = 7;
const ROW_HEIGHT = 77;

type StatusFilter = "ALL" | Exclude<OrderStatus, "PENDING">;

const FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "ALL", label: "Todos" },
  { value: "COMPLETED", label: "Concluídos" },
  { value: "CANCELLED", label: "Cancelados" },
  { value: "NO_SHOW", label: "Não compareceu" },
];

const dateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

function OrdersPage() {
  const { orders, isPending, isError, refetch } = useFinishedOrders();

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsOrderId, setDetailsOrderId] = useState<string | null>(null);

  const [filter, setFilter] = useState<StatusFilter>("ALL");
  const [page, setPage] = useState(0);

  const allOrders = orders ?? [];
  const rows =
    filter === "ALL"
      ? allOrders
      : allOrders.filter((order) => order.status === filter);

  const countOf = (value: StatusFilter) =>
    value === "ALL"
      ? allOrders.length
      : allOrders.filter((order) => order.status === value).length;

  const lastPage = Math.max(0, Math.ceil(rows.length / ROWS_PER_PAGE) - 1);
  const currentPage = Math.min(page, lastPage);
  const visibleRows = rows.slice(
    currentPage * ROWS_PER_PAGE,
    (currentPage + 1) * ROWS_PER_PAGE,
  );
  const emptyRows =
    currentPage > 0
      ? Math.max(0, (1 + currentPage) * ROWS_PER_PAGE - rows.length)
      : 0;

  const changeFilter = (value: StatusFilter) => {
    setFilter(value);
    setPage(0);
  };

  const openDetails = (orderId: string) => {
    setDetailsOrderId(orderId);
    setDetailsOpen(true);
  };

  return (
    <AppLayout>
      <Stack spacing={3}>
        <Stack>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Pedidos
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Histórico de pedidos finalizados: concluídos, cancelados e não
            retirados.
          </Typography>
        </Stack>

        {isPending && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
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
            Não foi possível carregar os pedidos.
          </Alert>
        )}

        {orders && orders.length === 0 && (
          <Paper variant="outlined" sx={{ p: 6, textAlign: "center" }}>
            <Typography sx={{ color: "text.secondary" }}>
              Nenhum pedido finalizado ainda.
            </Typography>
          </Paper>
        )}

        {allOrders.length > 0 && (
          <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
            {FILTERS.map(({ value, label }) => {
              const selected = filter === value;

              return (
                <Chip
                  key={value}
                  label={`${label} (${countOf(value)})`}
                  color={selected ? "primary" : "default"}
                  variant={selected ? "filled" : "outlined"}
                  aria-pressed={selected}
                  onClick={() => changeFilter(value)}
                />
              );
            })}
          </Stack>
        )}

        {allOrders.length > 0 && rows.length === 0 && (
          <Paper variant="outlined" sx={{ p: 6, textAlign: "center" }}>
            <Typography sx={{ color: "text.secondary" }}>
              Nenhum pedido com este status.
            </Typography>
          </Paper>
        )}

        {rows.length > 0 && (
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Total (R$)</TableCell>
                  <TableCell>Retirada</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Finalizado em</TableCell>
                  <TableCell align="right" />
                </TableRow>
              </TableHead>
              <TableBody>
                {visibleRows.map((order) => {
                  const pickup = formatPickupWindow(order.pickupWindow);

                  return (
                    <TableRow key={order.id} hover>
                      <TableCell>
                        <Stack
                          direction="row"
                          spacing={1.5}
                          sx={{ alignItems: "center" }}
                        >
                          <Avatar
                            src={
                              resolveMediaUrl(order.customer.avatarUrl) ??
                              undefined
                            }
                          >
                            {order.customer.fullname.charAt(0)}
                          </Avatar>
                          <Stack sx={{ minWidth: 0 }}>
                            <Typography
                              variant="body2"
                              noWrap
                              sx={{ fontWeight: 500 }}
                            >
                              {order.customer.fullname}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ color: "text.secondary" }}
                            >
                              {formatOrderId(order.id)}
                            </Typography>
                          </Stack>
                        </Stack>
                      </TableCell>

                      <TableCell sx={{ whiteSpace: "nowrap", fontWeight: 500 }}>
                        {formatCurrency(order.totalPrice)}
                      </TableCell>

                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        <Typography variant="body2">{pickup.day}</Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: "text.secondary" }}
                        >
                          {pickup.range}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <OrderStatusChip status={order.status} />
                      </TableCell>

                      <TableCell
                        sx={{ whiteSpace: "nowrap", color: "text.secondary" }}
                      >
                        {order.completedAt
                          ? dateTimeFormatter.format(
                              new Date(order.completedAt),
                            )
                          : "—"}
                      </TableCell>

                      <TableCell align="right">
                        <Tooltip title="Ver detalhes">
                          <IconButton
                            aria-label={`Ver detalhes do pedido de ${order.customer.fullname}`}
                            onClick={() => openDetails(order.id)}
                          >
                            <VisibilityOutlined />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}

                {emptyRows > 0 && (
                  <TableRow style={{ height: ROW_HEIGHT * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>

              <TableFooter>
                <TableRow>
                  <TablePagination
                    colSpan={6}
                    rowsPerPageOptions={[]}
                    count={rows.length}
                    rowsPerPage={ROWS_PER_PAGE}
                    page={currentPage}
                    onPageChange={(_event, newPage) => setPage(newPage)}
                    labelDisplayedRows={({ from, to, count }) =>
                      `${from} - ${to} de ${count}`
                    }
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        )}
      </Stack>

      <OrderDetailsDialog
        open={detailsOpen}
        orderId={detailsOrderId}
        onClose={() => setDetailsOpen(false)}
      />
    </AppLayout>
  );
}

export default OrdersPage;
