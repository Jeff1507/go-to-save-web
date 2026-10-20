import {
  Alert,
  Avatar,
  Box,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputAdornment,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Stack,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import {
  AddOutlined,
  ImageOutlined,
  RemoveOutlined,
} from "@mui/icons-material";
import {
  Controller,
  useWatch,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";
import { useProducts } from "../../core/hooks/use-products";
import { usePickupPresets } from "../../core/hooks/use-pickup-presets";
import {
  MAX_DISCOUNT,
  MIN_DISCOUNT,
  MONEY_REGEX,
  moneyToCents,
  type CreateBagPayload,
} from "../payloads/bag-payloads";
import { buildPickupWindow } from "../../utils/build-pickup-window";
import { formatCurrency } from "../../utils/format-currency";
import { formatTimeRange } from "../../utils/format-time";
import {
  MAX_PICKUP_MINUTES,
  MIN_PICKUP_MINUTES,
  durationMinutes,
  formatDuration,
  isValidPickupDuration,
} from "../../utils/pickup-duration";
import { resolveMediaUrl } from "../../utils/resolve-media-url";

interface StepProps {
  register: UseFormRegister<CreateBagPayload>;
  control: Control<CreateBagPayload>;
  errors: FieldErrors<CreateBagPayload>;
}

export function InfoStep({ register, control, errors }: StepProps) {
  const [originalPrice, discount] = useWatch({
    control,
    name: ["originalPrice", "discount"],
  });

  const validPrice = MONEY_REGEX.test(originalPrice.trim());
  const validDiscount =
    /^\d+$/.test(discount.trim()) &&
    Number(discount) >= MIN_DISCOUNT &&
    Number(discount) <= MAX_DISCOUNT;
  const estimatedFinalPrice =
    validPrice && validDiscount
      ? Math.round(
          (moneyToCents(originalPrice) * (100 - Number(discount))) / 100,
        )
      : null;

  return (
    <Stack spacing={2}>
      <TextField
        {...register("title")}
        label="Título"
        autoFocus
        error={!!errors.title}
        helperText={errors.title?.message}
      />
      <TextField
        {...register("description")}
        label="Descrição (opcional)"
        multiline
        minRows={3}
        error={!!errors.description}
        helperText={errors.description?.message}
      />

      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" },
        }}
      >
        <TextField
          {...register("stock")}
          label="Estoque"
          slotProps={{ htmlInput: { inputMode: "numeric" } }}
          error={!!errors.stock}
          helperText={errors.stock?.message}
        />
        <TextField
          {...register("originalPrice")}
          label="Preço original"
          slotProps={{
            htmlInput: { inputMode: "decimal" },
            input: {
              startAdornment: (
                <InputAdornment position="start">R$</InputAdornment>
              ),
            },
          }}
          error={!!errors.originalPrice}
          helperText={errors.originalPrice?.message}
        />
        <TextField
          {...register("discount")}
          label="Desconto"
          slotProps={{
            htmlInput: { inputMode: "numeric" },
            input: {
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            },
          }}
          error={!!errors.discount}
          helperText={
            errors.discount?.message ??
            `Entre ${MIN_DISCOUNT}% e ${MAX_DISCOUNT}%`
          }
        />
      </Box>

      {estimatedFinalPrice !== null && (
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Preço final estimado:{" "}
          <Box component="strong" sx={{ color: "text.primary" }}>
            {formatCurrency(estimatedFinalPrice)}
          </Box>
        </Typography>
      )}
    </Stack>
  );
}

export function ItemsStep({
  control,
  errors,
}: Pick<StepProps, "control" | "errors">) {
  const { products, isLoading, isError, refetch } = useProducts();

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert
        severity="error"
        action={
          <Button color="inherit" size="small" onClick={() => refetch()}>
            Tentar novamente
          </Button>
        }
      >
        Não foi possível carregar os seus produtos.
      </Alert>
    );
  }

  if (!products || products.length === 0) {
    return (
      <Alert severity="info">
        Você ainda não cadastrou nenhum produto. Cadastre produtos antes de
        criar uma sacola.
      </Alert>
    );
  }

  return (
    <Controller
      name="items"
      control={control}
      render={({ field }) => {
        const items = field.value;
        const itemsError = items.length === 0 ? errors.items : undefined;
        const quantityOf = (id: string) =>
          items.find((item) => item.productId === id)?.quantity;

        const toggle = (id: string) =>
          field.onChange(
            quantityOf(id) !== undefined
              ? items.filter((item) => item.productId !== id)
              : [...items, { productId: id, quantity: 1 }],
          );

        const setQuantity = (id: string, quantity: number) =>
          field.onChange(
            items.map((item) =>
              item.productId === id
                ? { ...item, quantity: Math.max(1, quantity) }
                : item,
            ),
          );

        return (
          <Stack spacing={1}>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Escolha os produtos da sacola e a quantidade de cada um.
            </Typography>

            <Stack
              divider={<Divider />}
              sx={{
                border: 1,
                borderColor: itemsError ? "error.main" : "divider",
                borderRadius: 2,
                maxHeight: 320,
                overflow: "auto",
              }}
            >
              {products.map((product) => {
                const quantity = quantityOf(product.id);
                const selected = quantity !== undefined;

                return (
                  <Stack
                    key={product.id}
                    direction="row"
                    sx={{ alignItems: "center", pr: 1.5 }}
                  >
                    <ListItemButton
                      onClick={() => toggle(product.id)}
                      sx={{ flex: 1, minWidth: 0 }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <Checkbox
                          edge="start"
                          checked={selected}
                          tabIndex={-1}
                          disableRipple
                        />
                      </ListItemIcon>
                      <ListItemAvatar>
                        <Avatar
                          variant="rounded"
                          src={resolveMediaUrl(product.imageUrl) ?? undefined}
                        >
                          <ImageOutlined />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={product.name}
                        slotProps={{ primary: { noWrap: true } }}
                      />
                    </ListItemButton>

                    {selected && (
                      <Stack direction="row" sx={{ alignItems: "center" }}>
                        <IconButton
                          size="small"
                          aria-label={`Diminuir quantidade de ${product.name}`}
                          disabled={quantity <= 1}
                          onClick={() => setQuantity(product.id, quantity - 1)}
                        >
                          <RemoveOutlined fontSize="small" />
                        </IconButton>
                        <Typography sx={{ minWidth: 28, textAlign: "center" }}>
                          {quantity}
                        </Typography>
                        <IconButton
                          size="small"
                          aria-label={`Aumentar quantidade de ${product.name}`}
                          onClick={() => setQuantity(product.id, quantity + 1)}
                        >
                          <AddOutlined fontSize="small" />
                        </IconButton>
                      </Stack>
                    )}
                  </Stack>
                );
              })}
            </Stack>

            {itemsError ? (
              <FormHelperText error>{itemsError.message}</FormHelperText>
            ) : (
              <FormHelperText>
                {items.length === 0
                  ? "Nenhum produto selecionado."
                  : `${items.length} ${items.length === 1 ? "produto selecionado" : "produtos selecionados"}.`}
              </FormHelperText>
            )}
          </Stack>
        );
      }}
    />
  );
}

const durationHint = `A janela deve durar entre ${MIN_PICKUP_MINUTES} minutos e ${MAX_PICKUP_MINUTES / 60} horas e pode passar da meia-noite.`;

export function PickupStep({ register, control, errors }: StepProps) {
  const { presets, isLoading: loadingPresets } = usePickupPresets();

  const [customPickup, presetId, customStart, customEnd] = useWatch({
    control,
    name: ["customPickup", "presetId", "customStart", "customEnd"],
  });

  const window = buildPickupWindow(
    { customPickup, presetId, customStart, customEnd },
    presets ?? [],
  );
  const validWindow =
    window && isValidPickupDuration(window.start, window.end) ? window : null;

  return (
    <Stack spacing={2}>
      <Controller
        name="customPickup"
        control={control}
        render={({ field }) => (
          <FormControlLabel
            label="Definir um horário de retirada personalizado"
            control={
              <Checkbox
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
              />
            }
          />
        )}
      />

      {customPickup ? (
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          }}
        >
          <TextField
            {...register("customStart")}
            label="Início"
            type="time"
            slotProps={{ inputLabel: { shrink: true } }}
            error={!!errors.customStart}
            helperText={errors.customStart?.message}
          />
          <TextField
            {...register("customEnd")}
            label="Fim"
            type="time"
            slotProps={{ inputLabel: { shrink: true } }}
            error={!!errors.customEnd}
            helperText={errors.customEnd?.message}
          />
        </Box>
      ) : (
        <Stack spacing={2}>
          {!loadingPresets && (presets?.length ?? 0) === 0 && (
            <Alert severity="info">
              Você ainda não tem janelas de retirada cadastradas. Marque a opção
              acima para definir um horário personalizado.
            </Alert>
          )}

          <Controller
            name="presetId"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Janela de retirada"
                disabled={loadingPresets || (presets?.length ?? 0) === 0}
                error={!!errors.presetId}
                helperText={errors.presetId?.message}
              >
                {presets?.map((preset) => {
                  const valid = isValidPickupDuration(preset.start, preset.end);

                  return (
                    <MenuItem
                      key={preset.id}
                      value={preset.id}
                      disabled={!valid}
                    >
                      {preset.name} ·{" "}
                      {formatTimeRange(preset.start, preset.end)}
                      {!valid && " (duração fora do limite)"}
                    </MenuItem>
                  );
                })}
              </TextField>
            )}
          />
        </Stack>
      )}

      <Typography variant="caption" sx={{ color: "text.secondary" }}>
        {durationHint}
      </Typography>

      {validWindow && (
        <Alert severity="success" icon={false}>
          Retirada das{" "}
          <strong>{formatTimeRange(validWindow.start, validWindow.end)}</strong>{" "}
          ·{" "}
          {formatDuration(durationMinutes(validWindow.start, validWindow.end))}
        </Alert>
      )}
    </Stack>
  );
}
