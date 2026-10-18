import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import type { PickupWindow } from "../../data/models/pickup-window";
import { useDeletePickupWindow } from "../../core/hooks/use-pickup-windows";

interface DeletePickupWindowDialogProps {
  open: boolean;
  pickupWindow: PickupWindow | null;
  onClose: () => void;
}

function DeletePickupWindowDialog({
  open,
  pickupWindow,
  onClose,
}: DeletePickupWindowDialogProps) {
  const { mutate: remove, isPending } = useDeletePickupWindow();

  return (
    <Dialog
      open={open}
      onClose={isPending ? undefined : onClose}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>Excluir janela de retirada</DialogTitle>

      <DialogContent>
        <DialogContentText>
          Tem certeza que deseja excluir <strong>{pickupWindow?.name}</strong>?
          Essa ação não pode ser desfeita.
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
          onClick={() =>
            pickupWindow && remove(pickupWindow.id, { onSuccess: onClose })
          }
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

export default DeletePickupWindowDialog;
