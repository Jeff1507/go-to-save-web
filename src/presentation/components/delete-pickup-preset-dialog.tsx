import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import type { PickupPreset } from "../../data/models/pickup-preset";
import { useDeletePickupPreset } from "../../core/hooks/use-pickup-presets";

interface DeletePickupPresetDialogProps {
  open: boolean;
  PickupPreset: PickupPreset | null;
  onClose: () => void;
}

function DeletePickupPresetDialog({
  open,
  PickupPreset,
  onClose,
}: DeletePickupPresetDialogProps) {
  const { mutate: remove, isPending } = useDeletePickupPreset();

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
          Tem certeza que deseja excluir <strong>{PickupPreset?.name}</strong>?
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
            PickupPreset && remove(PickupPreset.id, { onSuccess: onClose })
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

export default DeletePickupPresetDialog;
