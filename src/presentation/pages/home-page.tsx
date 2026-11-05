import { useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
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
  Typography,
} from "@mui/material";
import {
  CancelOutlined,
  CheckOutlined,
  MoreVertOutlined,
  PaidOutlined,
  PendingActionsOutlined,
  ShoppingBagOutlined,
  TaskAltOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import { usePendingOrders } from "../../core/hooks/use-orders";
import { useRequireUser, useStats } from "../../core/hooks/use-user";
import type { OrderSummary } from "../../data/models/order-summary";
import { formatCurrency } from "../../utils/format-currency";
import { formatOrderId } from "../../utils/format-order-id";
import { formatPickupWindow } from "../../utils/format-pickup-window";
import { resolveMediaUrl } from "../../utils/resolve-media-url";
import AppLayout from "../components/app-layout";
import CancelOrderDialog from "../components/cancel-order-dialog";
import CompleteOrderDialog from "../components/complete-order-dialog";
import OrderDetailsDialog from "../components/order-details-dialog";
import StatCard from "../components/stat-card";

const ROWS_PER_PAGE = 5;
const ROW_HEIGHT = 77;

const dateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

function HomePage() {
  const user = useRequireUser();
  const { orders, isPending, isError, refetch } = usePendingOrders();
  const { stats, isPending: loadingStats, isError: statsError } = useStats();

  const statsHint = (hint: string) =>
    statsError ? "Não foi possível carregar" : hint;

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsOrderId, setDetailsOrderId] = useState<string | null>(null);
  const [completeOpen, setCompleteOpen] = useState(false);
  const [completingOrder, setCompletingOrder] = useState<OrderSummary | null>(
    null,
  );

  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelingOrder, setCancelingOrder] = useState<OrderSummary | null>(
    null,
  );

  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [menuOrder, setMenuOrder] = useState<OrderSummary | null>(null);

  const [page, setPage] = useState(0);

  const rows = orders ?? [];
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

  const openDetails = (orderId: string) => {
    setDetailsOrderId(orderId);
    setDetailsOpen(true);
  };

  const openComplete = (order: OrderSummary) => {
    setCompletingOrder(order);
    setCompleteOpen(true);
  };

  const openCancel = (order: OrderSummary) => {
    setCancelingOrder(order);
    setCancelOpen(true);
  };

  const openMenu = (
    event: React.MouseEvent<HTMLElement>,
    order: OrderSummary,
  ) => {
    setMenuAnchor(event.currentTarget);
    setMenuOrder(order);
  };

  const closeMenu = () => setMenuAnchor(null);

  return (
    <AppLayout>
      <Stack spacing={3}>
        <Stack>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Olá, {user.name}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Acompanhe os pedidos que estão aguardando retirada.
          </Typography>
        </Stack>

        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              lg: "repeat(4, 1fr)",
            },
          }}
        >
          <StatCard
            label="Pedidos pendentes"
            icon={<PendingActionsOutlined />}
            value={orders ? orders.length : null}
            loading={isPending}
            hint="Aguardando retirada"
          />
          <StatCard
            label="Vendas de hoje"
            icon={<PaidOutlined />}
            value={stats ? formatCurrency(stats.todaySales) : null}
            loading={loadingStats}
            hint={statsHint("Pedidos concluídos hoje")}
          />
          <StatCard
            label="Sacolas ativas"
            icon={<ShoppingBagOutlined />}
            value={stats?.activeBags}
            loading={loadingStats}
            hint={statsHint("Ativas no momento")}
          />
          <StatCard
            label="Pedidos concluídos no mês"
            icon={<TaskAltOutlined />}
            value={stats?.completedOrdersMonth}
            loading={loadingStats}
            hint={statsHint("No mês atual")}
          />
        </Box>

        <Stack spacing={2}>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Pedidos pendentes
            </Typography>
            {orders && orders.length > 0 && (
              <Chip size="small" label={orders.length} />
            )}
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
              Não foi possível carregar os pedidos pendentes.
            </Alert>
          )}

          {orders && orders.length === 0 && (
            <Paper variant="outlined" sx={{ p: 6, textAlign: "center" }}>
              <Typography sx={{ color: "text.secondary" }}>
                Nenhum pedido pendente no momento.
              </Typography>
            </Paper>
          )}

          {orders && orders.length > 0 && (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Cliente</TableCell>
                    <TableCell>Retirada</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Pedido feito em</TableCell>
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

                        <TableCell sx={{ whiteSpace: "nowrap" }}>
                          <Typography variant="body2">{pickup.day}</Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: "text.secondary" }}
                          >
                            {pickup.range}
                          </Typography>
                        </TableCell>

                        <TableCell
                          sx={{ whiteSpace: "nowrap", fontWeight: 500 }}
                        >
                          {formatCurrency(order.totalPrice)}
                        </TableCell>

                        <TableCell
                          sx={{ whiteSpace: "nowrap", color: "text.secondary" }}
                        >
                          {dateTimeFormatter.format(new Date(order.createdAt))}
                        </TableCell>

                        <TableCell align="right">
                          <IconButton
                            aria-label={`Ações do pedido de ${order.customer.fullname}`}
                            aria-haspopup="menu"
                            onClick={(event) => openMenu(event, order)}
                          >
                            <MoreVertOutlined />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}

                  {emptyRows > 0 && (
                    <TableRow style={{ height: ROW_HEIGHT * emptyRows }}>
                      <TableCell colSpan={5} />
                    </TableRow>
                  )}
                </TableBody>

                <TableFooter>
                  <TableRow>
                    <TablePagination
                      colSpan={5}
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
      </Stack>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={closeMenu}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
      >
        <MenuItem
          onClick={() => {
            if (menuOrder) openDetails(menuOrder.id);
            closeMenu();
          }}
        >
          <ListItemIcon>
            <VisibilityOutlined fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Ver" />
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (menuOrder) openComplete(menuOrder);
            closeMenu();
          }}
        >
          <ListItemIcon>
            <CheckOutlined fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Completar" />
        </MenuItem>

        <Divider />

        <MenuItem
          onClick={() => {
            if (menuOrder) openCancel(menuOrder);
            closeMenu();
          }}
        >
          <ListItemIcon>
            <CancelOutlined fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText primary="Cancelar" sx={{ color: "error.main" }} />
        </MenuItem>
      </Menu>

      <CompleteOrderDialog
        open={completeOpen}
        order={completingOrder}
        onClose={() => setCompleteOpen(false)}
      />
      <CancelOrderDialog
        open={cancelOpen}
        order={cancelingOrder}
        onClose={() => setCancelOpen(false)}
      />
      <OrderDetailsDialog
        open={detailsOpen}
        orderId={detailsOrderId}
        onClose={() => setDetailsOpen(false)}
      />
    </AppLayout>
  );
}

export default HomePage;
