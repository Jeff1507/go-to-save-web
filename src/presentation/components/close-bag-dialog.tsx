import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useCloseBag } from "../../core/hooks/use-bags";
import type { BagSummary } from "../../data/models/bag-summary";

interface CloseBagDialogProps {
  open: boolean;
  bag: BagSummary | null;
  onClose: () => void;
}

function CloseBagDialog({ open, bag, onClose }: CloseBagDialogProps) {
  const { mutate: close, isPending } = useCloseBag();

  return (
    <Dialog
      open={open}
      onClose={isPending ? undefined : onClose}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>Fechar sacola</DialogTitle>

      <DialogContent>
        <DialogContentText>
          Tem certeza que deseja fechar <strong>{bag?.title}</strong>? Depois de
          fechada, a sacola não poderá mais ser editada nem ter o estoque
          ajustado, e não há como reabri-la novamente.
        </DialogContentText>

        {bag && bag.stock > 0 && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            Ainda há {bag.stock} {bag.stock === 1 ? "unidade" : "unidades"} em
            estoque.
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={isPending}>
          Cancelar
        </Button>
        <Button
          color="error"
          variant="contained"
          disabled={isPending}
          onClick={() => bag && close(bag.id, { onSuccess: onClose })}
        >
          {isPending ? (
            <CircularProgress size={22} color="inherit" />
          ) : (
            "Fechar sacola"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CloseBagDialog;
