import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { AddOutlined, RemoveOutlined } from "@mui/icons-material";
import { useUpdateBagStock } from "../../core/hooks/use-bags";
import type { BagSummary } from "../../data/models/bag-summary";
import {
  updateBagStockSchema,
  type UpdateBagStockPayload,
} from "../payloads/bag-payloads";

interface UpdateBagStockFormProps {
  open: boolean;
  bag: BagSummary | null;
  onClose: () => void;
}

function UpdateBagStockForm({ open, bag, onClose }: UpdateBagStockFormProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<UpdateBagStockPayload>({
    resolver: zodResolver(updateBagStockSchema),
    defaultValues: { stock: String(bag?.stock ?? 0) },
  });

  const { mutate: updateStock, isPending } = useUpdateBagStock();

  useEffect(() => {
    if (open) reset({ stock: String(bag?.stock ?? 0) });
  }, [open, bag, reset]);

  const stockValue = useWatch({ control, name: "stock" });
  const currentStock = bag?.stock ?? 0;
  const targetStock = /^\d+$/.test(stockValue.trim())
    ? Number(stockValue)
    : null;
  const delta = targetStock === null ? null : targetStock - currentStock;

  const step = (amount: number) =>
    setValue(
      "stock",
      String(Math.max(0, (targetStock ?? currentStock) + amount)),
      {
        shouldValidate: true,
        shouldDirty: true,
      },
    );

  const onSubmit = handleSubmit((values) => {
    if (!bag) return;

    const change = Number(values.stock) - bag.stock;
    if (change === 0) return;

    updateStock({ id: bag.id, delta: change }, { onSuccess: onClose });
  });

  return (
    <Dialog
      open={open}
      onClose={isPending ? undefined : onClose}
      fullWidth
      maxWidth="xs"
      slotProps={{
        paper: { component: "form", onSubmit },
      }}
    >
      <DialogTitle>Ajustar estoque</DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            <strong>{bag?.title}</strong>: estoque atual de{" "}
            <strong>{currentStock}</strong>{" "}
            {currentStock === 1 ? "unidade" : "unidades"}.
          </Typography>

          <TextField
            {...register("stock")}
            label="Novo estoque"
            autoFocus
            error={!!errors.stock}
            helperText={errors.stock?.message}
            slotProps={{
              htmlInput: {
                inputMode: "numeric",
                style: { textAlign: "center" },
              },
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton
                      size="small"
                      aria-label="Diminuir estoque"
                      disabled={(targetStock ?? 0) <= 0}
                      onClick={() => step(-1)}
                    >
                      <RemoveOutlined fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      aria-label="Aumentar estoque"
                      onClick={() => step(1)}
                    >
                      <AddOutlined fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Typography
            variant="body2"
            sx={{
              color:
                delta === null || delta === 0
                  ? "text.secondary"
                  : delta > 0
                    ? "success.main"
                    : "warning.main",
            }}
          >
            {delta === null || delta === 0
              ? "Nenhuma alteração."
              : `Alteração: ${delta > 0 ? "+" : ""}${delta} ${Math.abs(delta) === 1 ? "unidade" : "unidades"}`}
          </Typography>

          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            A diferença é aplicada sobre o estoque no momento da confirmação,
            então vendas feitas enquanto este diálogo está aberto são
            consideradas.
          </Typography>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={isPending}>
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={isPending || !delta}
        >
          {isPending ? (
            <CircularProgress size={22} color="inherit" />
          ) : (
            "Salvar"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default UpdateBagStockForm;
