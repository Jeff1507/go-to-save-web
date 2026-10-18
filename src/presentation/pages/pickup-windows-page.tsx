import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
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
  AddOutlined,
  DeleteOutlined,
  EditOutlined,
  MoreVertOutlined,
} from "@mui/icons-material";
import { usePickupWindows } from "../../core/hooks/use-pickup-windows";
import type { PickupWindow } from "../../data/models/pickup-window";
import CreatePickupWindowDialog from "../components/create-pickup-window-form";
import EditPickupWindowDialog from "../components/edit-pickup-window-form";
import DeletePickupWindowDialog from "../components/delete-pickup-window-dialog";
import AppLayout from "../components/app-layout";

const ROWS_PER_PAGE = 5;
const ROW_HEIGHT = 73;

function PickupWindowsPage() {
  const { pickupWindows, isPending, isError, refetch } = usePickupWindows();
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingWindow, setEditingWindow] = useState<PickupWindow | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingWindow, setDeletingWindow] = useState<PickupWindow | null>(
    null,
  );

  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [menuWindow, setMenuWindow] = useState<PickupWindow | null>(null);

  const [page, setPage] = useState(0);

  const rows = pickupWindows ?? [];
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

  const openCreate = () => setCreateOpen(true);

  const openEdit = (pickupWindow: PickupWindow) => {
    setEditingWindow(pickupWindow);
    setEditOpen(true);
  };

  const openDelete = (pickupWindow: PickupWindow) => {
    setDeletingWindow(pickupWindow);
    setDeleteOpen(true);
  };

  const openMenu = (
    event: React.MouseEvent<HTMLElement>,
    pickupWindow: PickupWindow,
  ) => {
    setMenuAnchor(event.currentTarget);
    setMenuWindow(pickupWindow);
  };

  const closeMenu = () => setMenuAnchor(null);

  return (
    <AppLayout>
      <Stack spacing={3}>
        <Stack
          direction="row"
          spacing={2}
          sx={{ alignItems: "center", justifyContent: "space-between" }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Janelas de retirada
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddOutlined />}
            onClick={openCreate}
          >
            Nova janela
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
            Não foi possível carregar as janelas de retirada.
          </Alert>
        )}

        {pickupWindows && pickupWindows.length === 0 && (
          <Paper variant="outlined" sx={{ p: 6, textAlign: "center" }}>
            <Typography sx={{ color: "text.secondary" }}>
              Você ainda não cadastrou nenhuma janela de retirada.
            </Typography>
          </Paper>
        )}

        {pickupWindows && pickupWindows.length > 0 && (
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>Horário</TableCell>
                  <TableCell align="right" />
                </TableRow>
              </TableHead>
              <TableBody>
                {visibleRows.map((pickupWindow) => (
                  <TableRow key={pickupWindow.id} hover>
                    <TableCell sx={{ fontWeight: 500 }}>
                      {pickupWindow.name}
                    </TableCell>
                    <TableCell sx={{ color: "text.secondary" }}>
                      {`${pickupWindow.start} — ${pickupWindow.end}`}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        aria-label={`Ações para ${pickupWindow.name}`}
                        aria-haspopup="menu"
                        onClick={(event) => openMenu(event, pickupWindow)}
                      >
                        <MoreVertOutlined />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}

                {emptyRows > 0 && (
                  <TableRow style={{ height: ROW_HEIGHT * emptyRows }}>
                    <TableCell colSpan={3} />
                  </TableRow>
                )}
              </TableBody>

              <TableFooter>
                <TableRow>
                  <TablePagination
                    colSpan={3}
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
            if (menuWindow) openEdit(menuWindow);
            closeMenu();
          }}
        >
          <ListItemIcon>
            <EditOutlined fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Editar" />
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (menuWindow) openDelete(menuWindow);
            closeMenu();
          }}
        >
          <ListItemIcon>
            <DeleteOutlined fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText primary="Excluir" sx={{ color: "error.main" }} />
        </MenuItem>
      </Menu>

      <CreatePickupWindowDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
      <EditPickupWindowDialog
        open={editOpen}
        pickupWindow={editingWindow}
        onClose={() => setEditOpen(false)}
      />
      <DeletePickupWindowDialog
        open={deleteOpen}
        pickupWindow={deletingWindow}
        onClose={() => setDeleteOpen(false)}
      />
    </AppLayout>
  );
}

export default PickupWindowsPage;
