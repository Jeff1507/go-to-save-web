import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Step,
  StepLabel,
  Stepper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useBag, useUpdateBag } from "../../core/hooks/use-bags";
import { usePickupPresets } from "../../core/hooks/use-pickup-presets";
import type { Bag } from "../../data/models/bag";
import type { PickupPreset } from "../../data/models/pickup-preset";
import {
  moneyToCents,
  updateBagSchema,
  type CreateBagPayload,
} from "../payloads/bag-payloads";
import { buildPickupWindow } from "../../utils/build-pickup-window";
import { InfoStep, ItemsStep, PickupStep } from "./create-bag-steps";

const STEPS = ["Informações", "Itens", "Retirada"];
const LAST_STEP = STEPS.length - 1;
const stepFields: Record<number, (keyof CreateBagPayload)[]> = {
  0: ["title", "description", "originalPrice", "discount"],
  1: ["items"],
  2: ["customPickup", "presetId", "customStart", "customEnd"],
};

const timeOf = (iso: string) => iso.slice(11, 16);

const centsToInput = (cents: number) =>
  (cents / 100).toFixed(2).replace(".", ",");

function toFormValues(bag: Bag, presets: PickupPreset[]): CreateBagPayload {
  const start = timeOf(bag.pickupWindow.start);
  const end = timeOf(bag.pickupWindow.end);

  const preset = presets.find((p) => p.start === start && p.end === end);

  return {
    title: bag.title,
    description: bag.description ?? "",
    stock: String(bag.stock),
    originalPrice: centsToInput(bag.originalPrice),
    discount: String(bag.discount),
    items: [],
    customPickup: !preset,
    presetId: preset?.id ?? "",
    customStart: preset ? "" : start,
    customEnd: preset ? "" : end,
  };
}

function toPayload(values: CreateBagPayload, presets: PickupPreset[]) {
  const pickupWindow = buildPickupWindow(values, presets);
  if (!pickupWindow) return null;

  return {
    title: values.title,
    description: values.description || null,
    originalPrice: moneyToCents(values.originalPrice),
    discount: Number(values.discount),
    pickupWindow,
    items: values.items,
  };
}

type UpdateBag = ReturnType<typeof useUpdateBag>["mutate"];

interface EditBagFormContentProps {
  bag: Bag;
  presets: PickupPreset[];
  update: UpdateBag;
  isPending: boolean;
  onClose: () => void;
}

function EditBagFormContent({
  bag,
  presets,
  update,
  isPending,
  onClose,
}: EditBagFormContentProps) {
  const [activeStep, setActiveStep] = useState(0);

  const {
    register,
    control,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<CreateBagPayload>({
    resolver: zodResolver(
      updateBagSchema,
    ) as unknown as Resolver<CreateBagPayload>,
    defaultValues: toFormValues(bag, presets),
  });

  const handleBack = () => setActiveStep((step) => step - 1);

  const handleNext = async () => {
    const fields = stepFields[activeStep];
    if (fields && !(await trigger(fields))) return;
    setActiveStep((step) => step + 1);
  };

  const onSubmit = handleSubmit((values) => {
    const payload = toPayload(values, presets);
    if (!payload) return;

    update({ id: bag.id, ...payload }, { onSuccess: onClose });
  });

  return (
    <>
      <DialogTitle>Editar sacola</DialogTitle>

      <DialogContent>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
          {STEPS.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 && (
          <InfoStep
            register={register}
            control={control}
            errors={errors}
            showStock={false}
          />
        )}
        {activeStep === 1 && (
          <Stack spacing={2}>
            <Alert severity="info">
              Selecione novamente os produtos desta sacola.
              {bag.items.length > 0 && (
                <>
                  {" "}
                  Itens atuais:{" "}
                  {bag.items
                    .map((item) => `${item.name} (x${item.quantity})`)
                    .join(", ")}
                  .
                </>
              )}
            </Alert>
            <ItemsStep control={control} errors={errors} />
          </Stack>
        )}
        {activeStep === 2 && (
          <PickupStep register={register} control={control} errors={errors} />
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        {activeStep === 0 ? (
          <Button onClick={onClose} disabled={isPending}>
            Cancelar
          </Button>
        ) : (
          <Button onClick={handleBack} disabled={isPending}>
            Voltar
          </Button>
        )}

        <Button
          variant="contained"
          onClick={activeStep < LAST_STEP ? handleNext : onSubmit}
          disabled={isPending}
        >
          {isPending ? (
            <CircularProgress size={22} color="inherit" />
          ) : activeStep < LAST_STEP ? (
            "Próximo"
          ) : (
            "Salvar alterações"
          )}
        </Button>
      </DialogActions>
    </>
  );
}

interface EditBagFormProps {
  open: boolean;
  bagId: string | null;
  onClose: () => void;
}

function EditBagForm({ open, bagId, onClose }: EditBagFormProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const { bag, isError, refetch } = useBag(bagId);
  const { presets, isLoading: loadingPresets } = usePickupPresets();
  const { mutate: update, isPending } = useUpdateBag();

  const ready = !!bag && !loadingPresets;

  return (
    <Dialog
      open={open}
      onClose={isPending ? undefined : onClose}
      fullWidth
      maxWidth="sm"
      fullScreen={fullScreen}
    >
      {ready ? (
        <EditBagFormContent
          key={`${bag.id}-${bag.updatedAt}`}
          bag={bag}
          presets={presets ?? []}
          update={update}
          isPending={isPending}
          onClose={onClose}
        />
      ) : (
        <>
          <DialogTitle>Editar sacola</DialogTitle>
          <DialogContent>
            {isError ? (
              <Alert
                severity="error"
                action={
                  <Button
                    color="inherit"
                    size="small"
                    onClick={() => refetch()}
                  >
                    Tentar novamente
                  </Button>
                }
              >
                Não foi possível carregar a sacola.
              </Alert>
            ) : (
              <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                <CircularProgress />
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={onClose}>Fechar</Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}

export default EditBagForm;
