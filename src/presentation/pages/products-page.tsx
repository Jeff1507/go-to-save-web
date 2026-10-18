import { useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  AddOutlined,
  DeleteOutlined,
  EditOutlined,
  ImageOutlined,
} from "@mui/icons-material";
import { useProducts } from "../../core/hooks/use-products";
import type { Product } from "../../data/models/product";
import CreateProductDialog from "../components/create-product-form";
import EditProductDialog from "../components/edit-product-form";
import DeleteProductDialog from "../components/delete-product-dialog";
import { formatDate } from "../../utils/format-date";
import { resolveMediaUrl } from "../../utils/resolve-media-url";
import AppLayout from "../components/app-layout";

function ProductsPage() {
  const { products, isPending, isError, refetch } = useProducts();
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  const openCreate = () => setCreateOpen(true);

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setEditOpen(true);
  };

  const openDelete = (product: Product) => {
    setDeletingProduct(product);
    setDeleteOpen(true);
  };

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
            <Stack spacing={2} sx={{ alignItems: "center" }}>
              <Typography sx={{ color: "text.secondary" }}>
                Você ainda não cadastrou nenhum produto.
              </Typography>
              <Button
                variant="outlined"
                startIcon={<AddOutlined />}
                onClick={openCreate}
              >
                Cadastrar primeiro produto
              </Button>
            </Stack>
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
                {products.map((product) => (
                  <TableRow key={product.id} hover>
                    <TableCell>
                      <Avatar
                        variant="rounded"
                        src={resolveMediaUrl(product.imageUrl) ?? undefined}
                        sx={{ width: 64, height: 64 }}
                      >
                        <ImageOutlined />
                      </Avatar>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>
                      {product.name}
                    </TableCell>
                    <TableCell sx={{ color: "text.secondary" }}>
                      {formatDate(product.updatedAt)}
                    </TableCell>
                    <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                      <Tooltip title="Editar">
                        <IconButton
                          aria-label={`Editar ${product.name}`}
                          onClick={() => openEdit(product)}
                        >
                          <EditOutlined />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Excluir">
                        <IconButton
                          aria-label={`Excluir ${product.name}`}
                          color="error"
                          onClick={() => openDelete(product)}
                        >
                          <DeleteOutlined />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Stack>

      <CreateProductDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
      <EditProductDialog
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
