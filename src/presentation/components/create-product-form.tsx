import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
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
import {
  createProductSchema,
  type CreateProductPayload,
} from "../payloads/product-payloads";
import { useCreateProduct } from "../../core/hooks/use-products";
import ImageField from "./image-field";

interface CreateProductFormProps {
  open: boolean;
  onClose: () => void;
}

const emptyValues: CreateProductPayload = { name: "", image: null };

function CreateProductForm({ open, onClose }: CreateProductFormProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    trigger,
    formState: { errors },
  } = useForm<CreateProductPayload>({
    resolver: zodResolver(createProductSchema),
    defaultValues: emptyValues,
  });

  const { mutate: create, isPending } = useCreateProduct();

  useEffect(() => {
    if (open) reset(emptyValues);
  }, [open, reset]);

  const onSubmit = (data: CreateProductPayload) => {
    create(data, { onSuccess: onClose });
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
      <DialogTitle>Novo produto</DialogTitle>

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
            "Adicionar"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CreateProductForm;
