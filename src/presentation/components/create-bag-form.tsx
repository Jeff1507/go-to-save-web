import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Step,
  StepLabel,
  Stepper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useCreateBag } from "../../core/hooks/use-bags";
import { usePickupPresets } from "../../core/hooks/use-pickup-presets";
import type { PickupPreset } from "../../data/models/pickup-preset";
import {
  createBagSchema,
  MIN_DISCOUNT,
  moneyToCents,
  type CreateBagPayload,
} from "../payloads/bag-payloads";
import { buildPickupWindow } from "../../utils/build-pickup-window";
import { InfoStep, ItemsStep, PickupStep } from "./create-bag-steps";

const STEPS = ["Informações", "Itens", "Retirada"];
const LAST_STEP = STEPS.length - 1;
const stepFields: Record<number, (keyof CreateBagPayload)[]> = {
  0: ["title", "description", "stock", "originalPrice", "discount"],
  1: ["items"],
  2: ["customPickup", "presetId", "customStart", "customEnd"],
};

const createBagDefaults: CreateBagPayload = {
  title: "",
  description: "",
  stock: "1",
  originalPrice: "",
  discount: String(MIN_DISCOUNT),
  items: [],
  customPickup: false,
  presetId: "",
  customStart: "",
  customEnd: "",
};

interface CreateBagFormProps {
  open: boolean;
  onClose: () => void;
}

function toPayload(values: CreateBagPayload, presets: PickupPreset[]) {
  const pickupWindow = buildPickupWindow(values, presets);
  if (!pickupWindow) return null;

  return {
    title: values.title,
    description: values.description || null,
    stock: Number(values.stock),
    originalPrice: moneyToCents(values.originalPrice),
    discount: Number(values.discount),
    pickupWindow,
    items: values.items,
  };
}

function CreateBagForm({ open, onClose }: CreateBagFormProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [activeStep, setActiveStep] = useState(0);

  const { presets } = usePickupPresets();
  const { mutate: create, isPending } = useCreateBag();

  const {
    register,
    control,
    handleSubmit,
    trigger,
    reset,
    formState: { errors },
  } = useForm<CreateBagPayload>({
    resolver: zodResolver(createBagSchema),
    defaultValues: createBagDefaults,
  });

  useEffect(() => {
    if (open) {
      reset(createBagDefaults);
      setActiveStep(0);
    }
  }, [open, reset]);

  const handleBack = () => setActiveStep((step) => step - 1);

  const handleNext = async () => {
    const fields = stepFields[activeStep];
    if (fields && !(await trigger(fields))) return;
    setActiveStep((step) => step + 1);
  };

  const onSubmit = handleSubmit((values) => {
    const payload = toPayload(values, presets ?? []);
    if (!payload) return;

    create(payload, { onSuccess: onClose });
  });

  return (
    <Dialog
      open={open}
      onClose={isPending ? undefined : onClose}
      fullWidth
      maxWidth="sm"
      fullScreen={fullScreen}
    >
      <DialogTitle>Nova sacola</DialogTitle>

      <DialogContent>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
          {STEPS.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 && (
          <InfoStep register={register} control={control} errors={errors} />
        )}
        {activeStep === 1 && <ItemsStep control={control} errors={errors} />}
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
            "Criar sacola"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CreateBagForm;
