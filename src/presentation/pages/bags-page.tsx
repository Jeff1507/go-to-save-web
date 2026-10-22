import { useState } from "react";
import {
  Alert,
  Box,
  Button,
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
  Tooltip,
  Typography,
} from "@mui/material";
import {
  AddOutlined,
  EditOutlined,
  Inventory2Outlined,
  LockOutlined,
  MoreVertOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import { useBags } from "../../core/hooks/use-bags";
import type { BagSummary } from "../../data/models/bag-summary";
import { formatCurrency } from "../../utils/format-currency";
import { formatPickupWindow } from "../../utils/format-pickup-window";
import AppLayout from "../components/app-layout";
import BagDetailsDialog from "../components/bag-details-dialog";
import CreateBagForm from "../components/create-bag-form";
import CloseBagDialog from "../components/close-bag-dialog";
import EditBagForm from "../components/edit-bag-form";
import UpdateBagStockForm from "../components/update-bag-stock-form";
import BagStatusChip from "../components/bag-status-chip";

const ROWS_PER_PAGE = 5;
const ROW_HEIGHT = 77;

function BagsPage() {
  const { bags, isPending, isError, refetch } = useBags();

  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [menuBag, setMenuBag] = useState<BagSummary | null>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingBagId, setEditingBagId] = useState<string | null>(null);
  const [stockOpen, setStockOpen] = useState(false);
  const [stockBag, setStockBag] = useState<BagSummary | null>(null);
  const [closeOpen, setCloseOpen] = useState(false);
  const [closingBag, setClosingBag] = useState<BagSummary | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsBagId, setDetailsBagId] = useState<string | null>(null);

  const [page, setPage] = useState(0);

  const rows = bags ?? [];
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

  const openDetails = (bag: BagSummary) => {
    setDetailsBagId(bag.id);
    setDetailsOpen(true);
  };

  const openEdit = (bag: BagSummary) => {
    setEditingBagId(bag.id);
    setEditOpen(true);
  };

  const openStock = (bag: BagSummary) => {
    setStockBag(bag);
    setStockOpen(true);
  };

  const openClose = (bag: BagSummary) => {
    setClosingBag(bag);
    setCloseOpen(true);
  };

  const openMenu = (event: React.MouseEvent<HTMLElement>, bag: BagSummary) => {
    setMenuAnchor(event.currentTarget);
    setMenuBag(bag);
  };

  const closeMenu = () => setMenuAnchor(null);

  const isClosed = menuBag?.status === "CLOSED";

  return (
    <AppLayout>
      <Stack spacing={3}>
        <Stack
          direction="row"
          spacing={2}
          sx={{ alignItems: "center", justifyContent: "space-between" }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Sacolas
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddOutlined />}
            onClick={() => setCreateOpen(true)}
          >
            Nova sacola
          </Button>
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
            Não foi possível carregar as sacolas.
          </Alert>
        )}

        {bags && bags.length === 0 && (
          <Paper variant="outlined" sx={{ p: 6, textAlign: "center" }}>
            <Typography sx={{ color: "text.secondary" }}>
              Você ainda não cadastrou nenhuma sacola.
            </Typography>
          </Paper>
        )}

        {bags && bags.length > 0 && (
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Título</TableCell>
                  <TableCell align="right">Estoque</TableCell>
                  <TableCell>Preço (R$)</TableCell>
                  <TableCell>Retirada</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right" />
                </TableRow>
              </TableHead>
              <TableBody>
                {visibleRows.map((bag) => {
                  const pickup = formatPickupWindow(bag.pickupWindow);

                  return (
                    <TableRow key={bag.id} hover>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {bag.title}
                        </Typography>
                        {bag.description && (
                          <Typography
                            variant="caption"
                            noWrap
                            sx={{
                              display: "block",
                              maxWidth: 280,
                              color: "text.secondary",
                            }}
                          >
                            {bag.description}
                          </Typography>
                        )}
                      </TableCell>

                      <TableCell
                        align="right"
                        sx={{
                          color: bag.stock === 0 ? "text.secondary" : undefined,
                        }}
                      >
                        {bag.stock}
                      </TableCell>

                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {formatCurrency(bag.finalPrice)}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: "text.secondary" }}
                        >
                          {bag.discount > 0 && (
                            <Box
                              component="span"
                              sx={{ textDecoration: "line-through", mr: 0.5 }}
                            >
                              {formatCurrency(bag.originalPrice)}
                            </Box>
                          )}
                          {bag.discount > 0 && `(-${bag.discount}%)`}
                        </Typography>
                      </TableCell>

                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        <Typography variant="body2">{pickup.day}</Typography>
                        {pickup.endsOn ? (
                          <Tooltip title={`Termina em ${pickup.endsOn}`}>
                            <Typography
                              variant="caption"
                              sx={{ color: "text.secondary" }}
                            >
                              {pickup.range}
                            </Typography>
                          </Tooltip>
                        ) : (
                          <Typography
                            variant="caption"
                            sx={{ color: "text.secondary" }}
                          >
                            {pickup.range}
                          </Typography>
                        )}
                      </TableCell>

                      <TableCell>
                        <BagStatusChip status={bag.status} />
                      </TableCell>

                      <TableCell align="right">
                        <IconButton
                          aria-label={`Ações para ${bag.title}`}
                          aria-haspopup="menu"
                          onClick={(event) => openMenu(event, bag)}
                        >
                          <MoreVertOutlined />
                        </IconButton>
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

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={closeMenu}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
      >
        <MenuItem
          onClick={() => {
            if (menuBag) openDetails(menuBag);
            closeMenu();
          }}
        >
          <ListItemIcon>
            <VisibilityOutlined fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Ver" />
        </MenuItem>
        <MenuItem
          disabled={isClosed}
          onClick={() => {
            if (menuBag) openEdit(menuBag);
            closeMenu();
          }}
        >
          <ListItemIcon>
            <EditOutlined fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Editar" />
        </MenuItem>
        <MenuItem
          disabled={isClosed}
          onClick={() => {
            if (menuBag) openStock(menuBag);
            closeMenu();
          }}
        >
          <ListItemIcon>
            <Inventory2Outlined fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Ajustar estoque" />
        </MenuItem>

        <Divider />

        <MenuItem
          disabled={isClosed}
          onClick={() => {
            if (menuBag) openClose(menuBag);
            closeMenu();
          }}
        >
          <ListItemIcon>
            <LockOutlined
              fontSize="small"
              color={isClosed ? "disabled" : "error"}
            />
          </ListItemIcon>
          <ListItemText
            primary="Fechar"
            sx={{ color: isClosed ? undefined : "error.main" }}
          />
        </MenuItem>
      </Menu>

      <CreateBagForm open={createOpen} onClose={() => setCreateOpen(false)} />
      <EditBagForm
        open={editOpen}
        bagId={editingBagId}
        onClose={() => setEditOpen(false)}
      />
      <UpdateBagStockForm
        open={stockOpen}
        bag={stockBag}
        onClose={() => setStockOpen(false)}
      />
      <CloseBagDialog
        open={closeOpen}
        bag={closingBag}
        onClose={() => setCloseOpen(false)}
      />
      <BagDetailsDialog
        open={detailsOpen}
        bagId={detailsBagId}
        onClose={() => setDetailsOpen(false)}
      />
    </AppLayout>
  );
}

export default BagsPage;
