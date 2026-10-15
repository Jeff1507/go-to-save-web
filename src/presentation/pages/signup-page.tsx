import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { signupUser } from "../../data/repositories/auth-repository";
import Logo from "../components/logo";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupPayload } from "../payloads/auth-payloads";
import type { AddressPayload } from "../payloads/user-payloads";
import { onlyDigits } from "../../utils/cnpj";
import AddressLocationForm from "../components/address-location-form";
import { useToast } from "../../core/hooks/use-toast";

const steps = ["Dados da loja", "Endereço", "Revisão"];
const LAST_STEP = steps.length - 1;
const stepFields: Record<number, (keyof SignupPayload)[]> = {
  0: ["name", "email", "cnpj", "password", "confirmPassword"],
};

function ReviewSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Stack spacing={0.5}>
      <Typography variant="subtitle1">{title}</Typography>
      {children}
    </Stack>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <Stack direction="row" spacing={2} sx={{ justifyContent: "space-between" }}>
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ textAlign: "right" }}>
        {value}
      </Typography>
    </Stack>
  );
}

function SignupPage() {
  const toast = useToast();
  const [activeStep, setActiveStep] = useState(0);
  const [addressData, setAddressData] = useState<AddressPayload | null>(null);
  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<SignupPayload>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      cnpj: "",
      password: "",
      confirmPassword: "",
    },
  });
  const { mutate: signup, isPending } = useMutation({
    mutationFn: signupUser,
    onSuccess: () => {
      toast.show("Conta criada com sucesso!");
    },
    onError: (error) => {
      toast.show(error.message, "error");
    },
  });

  const handleBack = () => setActiveStep((step) => step - 1);

  const handleNext = async () => {
    const fields = stepFields[activeStep];
    if (fields && !(await trigger(fields))) return;
    setActiveStep((step) => step + 1);
  };

  const submitAddressForm = () => {
    const form = document.getElementById(
      "address-form",
    ) as HTMLFormElement | null;
    form?.requestSubmit();
  };

  const onSubmit = handleSubmit((values) => {
    if (!addressData) return;

    signup({
      email: values.email,
      name: values.name,
      cnpj: onlyDigits(values.cnpj),
      password: values.password,
      address: addressData,
    });
  });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Stack
        spacing={{ xs: 4, md: 6 }}
        component={Paper}
        sx={{
          width: { xs: "100%", md: 600 },
          alignItems: "stretch",
          p: { xs: 2, md: 4 },
          boxShadow: (theme) => ({
            xs: theme.shadows[0],
            md: theme.shadows[3],
          }),
        }}
      >
        <Stack spacing={{ xs: 1, md: 2 }}>
          <Logo />
          <Typography align="center" sx={{ color: "text.secondary" }}>
            Crie sua conta e comece a salvar agora.
          </Typography>
        </Stack>

        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 && (
          <Stack spacing={2}>
            <TextField
              {...register("name")}
              label="Nome"
              autoFocus
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <TextField
              {...register("email")}
              label="Email"
              type="email"
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              {...register("cnpj")}
              label="CNPJ"
              slotProps={{ htmlInput: { inputMode: "numeric" } }}
              error={!!errors.cnpj}
              helperText={errors.cnpj?.message}
            />
            <TextField
              {...register("password")}
              label="Senha"
              type="password"
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <TextField
              {...register("confirmPassword")}
              label="Confirmar senha"
              type="password"
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
            />
          </Stack>
        )}

        {activeStep === 1 && (
          <AddressLocationForm
            defaultValues={addressData}
            onSubmit={(data) => {
              setAddressData(data);
              setActiveStep(2);
            }}
          />
        )}

        {activeStep === 2 && addressData && (
          <Stack spacing={2}>
            <ReviewSection title="Dados da loja">
              <ReviewRow label="Nome" value={getValues("name")} />
              <ReviewRow label="Email" value={getValues("email")} />
              <ReviewRow label="CNPJ" value={getValues("cnpj")} />
            </ReviewSection>

            <ReviewSection title="Endereço">
              <ReviewRow
                label="Rua"
                value={`${addressData.street}, ${addressData.number ?? "s/n"}${
                  addressData.complement ? ` - ${addressData.complement}` : ""
                }`}
              />
              <ReviewRow label="Bairro" value={addressData.neighborhood} />
              <ReviewRow
                label="Cidade"
                value={`${addressData.city} - ${addressData.state}`}
              />
              <ReviewRow label="CEP" value={addressData.postalCode} />
            </ReviewSection>
          </Stack>
        )}

        <Stack direction="row" spacing={2} sx={{ justifyContent: "end" }}>
          {activeStep > 0 && (
            <Button onClick={handleBack} disabled={isPending}>
              Voltar
            </Button>
          )}
          {activeStep < LAST_STEP ? (
            <Button
              variant="contained"
              onClick={activeStep === 1 ? submitAddressForm : handleNext}
            >
              Próximo
            </Button>
          ) : (
            <Button variant="contained" onClick={onSubmit} disabled={isPending}>
              {isPending ? (
                <CircularProgress size={22} color="inherit" />
              ) : (
                "Cadastrar"
              )}
            </Button>
          )}
        </Stack>
      </Stack>
    </Box>
  );
}

export default SignupPage;
