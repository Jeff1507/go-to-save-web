import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import type { Product } from "../../data/models/product";
import { useDeleteProduct } from "../../core/hooks/use-products";

interface DeleteProductDialogProps {
  open: boolean;
  product: Product | null;
  onClose: () => void;
}

function DeleteProductDialog({
  open,
  product,
  onClose,
}: DeleteProductDialogProps) {
  const { mutate: remove, isPending } = useDeleteProduct();

  return (
    <Dialog
      open={open}
      onClose={isPending ? undefined : onClose}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>Excluir produto</DialogTitle>

      <DialogContent>
        <DialogContentText>
          Tem certeza que deseja excluir <strong>{product?.name}</strong>? Essa
          ação não pode ser desfeita.
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={isPending}>
          Cancelar
        </Button>
        <Button
          color="error"
          variant="contained"
          disabled={isPending}
          onClick={() => product && remove(product.id, { onSuccess: onClose })}
        >
          {isPending ? (
            <CircularProgress size={22} color="inherit" />
          ) : (
            "Excluir"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteProductDialog;
