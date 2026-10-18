import { useState } from "react";
import {
  Alert,
  Avatar,
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
  ImageOutlined,
  MoreVertOutlined,
} from "@mui/icons-material";
import { useProducts } from "../../core/hooks/use-products";
import type { Product } from "../../data/models/product";
import CreateProductForm from "../components/create-product-form";
import EditProductForm from "../components/edit-product-form";
import DeleteProductDialog from "../components/delete-product-dialog";
import { formatDate } from "../../utils/format-date";
import { resolveMediaUrl } from "../../utils/resolve-media-url";
import AppLayout from "../components/app-layout";

const ROWS_PER_PAGE = 5;
const ROW_HEIGHT = 97;

function ProductsPage() {
  const { products, isPending, isError, refetch } = useProducts();
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [menuProduct, setMenuProduct] = useState<Product | null>(null);

  const [page, setPage] = useState(0);

  const rows = products ?? [];
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

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setEditOpen(true);
  };

  const openDelete = (product: Product) => {
    setDeletingProduct(product);
    setDeleteOpen(true);
  };

  const openMenu = (event: React.MouseEvent<HTMLElement>, product: Product) => {
    setMenuAnchor(event.currentTarget);
    setMenuProduct(product);
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
            Produtos
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddOutlined />}
            onClick={openCreate}
          >
            Novo produto
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
            Não foi possível carregar os produtos.
          </Alert>
        )}

        {products && products.length === 0 && (
          <Paper variant="outlined" sx={{ p: 6, textAlign: "center" }}>
            <Typography sx={{ color: "text.secondary" }}>
              Você ainda não cadastrou nenhum produto.
            </Typography>
          </Paper>
        )}

        {products && products.length > 0 && (
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell width={72}>Imagem</TableCell>
                  <TableCell>Nome</TableCell>
                  <TableCell>Modificado em</TableCell>
                  <TableCell align="right" />
                </TableRow>
              </TableHead>
              <TableBody>
                {visibleRows.map((product) => (
                  <TableRow key={product.id} hover>
                    <TableCell>
                      <Avatar
                        variant="rounded"
                        src={resolveMediaUrl(product.imageUrl) ?? undefined}
                        sx={{ width: 64, height: 64 }}
                      >
                        <ImageOutlined fontSize="small" />
                      </Avatar>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>
                      {product.name}
                    </TableCell>
                    <TableCell sx={{ color: "text.secondary" }}>
                      {formatDate(product.updatedAt)}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        aria-label={`Ações para ${product.name}`}
                        aria-haspopup="menu"
                        onClick={(event) => openMenu(event, product)}
                      >
                        <MoreVertOutlined />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}

                {emptyRows > 0 && (
                  <TableRow style={{ height: ROW_HEIGHT * emptyRows }}>
                    <TableCell colSpan={4} />
                  </TableRow>
                )}
              </TableBody>

              <TableFooter>
                <TableRow>
                  <TablePagination
                    colSpan={4}
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
            if (menuProduct) openEdit(menuProduct);
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
            if (menuProduct) openDelete(menuProduct);
            closeMenu();
          }}
        >
          <ListItemIcon>
            <DeleteOutlined fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText primary="Excluir" sx={{ color: "error.main" }} />
        </MenuItem>
      </Menu>

      <CreateProductForm
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
      <EditProductForm
        open={editOpen}
        product={editingProduct}
        onClose={() => setEditOpen(false)}
      />
      <DeleteProductDialog
        open={deleteOpen}
        product={deletingProduct}
        onClose={() => setDeleteOpen(false)}
      />
    </AppLayout>
  );
}

export default ProductsPage;
