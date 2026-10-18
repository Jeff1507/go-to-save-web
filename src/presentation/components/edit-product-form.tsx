import { useEffect } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import type { Product } from "../../data/models/product";
import {
  updateProductSchema,
  type UpdateProductPayload,
} from "../payloads/product-payloads";
import { useUpdateProduct } from "../../core/hooks/use-products";
import ImageField from "./image-field";
import { resolveMediaUrl } from "../../utils/resolve-media-url";

interface EditProductFormProps {
  open: boolean;
  product: Product | null;
  onClose: () => void;
}

function toFormValues(product: Product | null): UpdateProductPayload {
  return {
    name: product?.name ?? "",
    image: null,
    removeImage: false,
  };
}

function EditProductForm({ open, product, onClose }: EditProductFormProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<UpdateProductPayload>({
    resolver: zodResolver(updateProductSchema),
    defaultValues: toFormValues(product),
  });

  const removeImage = useWatch({ control, name: "removeImage" });
  const { mutate: update, isPending } = useUpdateProduct();

  useEffect(() => {
    if (open) reset(toFormValues(product));
  }, [open, product, reset]);

  const onSubmit = (data: UpdateProductPayload) => {
    if (!product) return;
    update({ id: product.id, ...data }, { onSuccess: onClose });
  };

  return (
    <Dialog
      open={open}
      onClose={isPending ? undefined : onClose}
      fullWidth
      maxWidth="xs"
      slotProps={{
        paper: {
          component: "form",
          onSubmit: handleSubmit(onSubmit),
        },
      }}
    >
      <DialogTitle>Editar produto</DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ pt: 1 }}>
          <TextField
            {...register("name")}
            label="Nome"
            autoFocus
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          <Controller
            name="image"
            control={control}
            render={({ field }) => (
              <ImageField
                file={field.value}
                onFileChange={(file) => {
                  field.onChange(file);
                  void trigger("image");
                }}
                currentUrl={resolveMediaUrl(product?.imageUrl!)}
                removeCurrent={removeImage}
                onRemoveCurrentChange={(remove) =>
                  setValue("removeImage", remove, { shouldDirty: true })
                }
                error={errors.image?.message}
              />
            )}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={isPending}>
          Cancelar
        </Button>
        <Button type="submit" variant="contained" disabled={isPending}>
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

export default EditProductForm;
