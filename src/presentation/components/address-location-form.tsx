import { useEffect, useRef } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import {
  addressFormSchema,
  type AddressFormValues,
  type AddressPayload,
} from "../payloads/user-payloads";
import { useCepLookup } from "../../core/hooks/use-cep-lookup";
import { useGeocode } from "../../core/hooks/use-geocode";
import { onlyDigits } from "../../utils/cnpj";

interface AddressLocationProps {
  onSubmit: (address: AddressPayload) => void;
  defaultValues?: AddressPayload | null;
}

function toFormValues(address?: AddressPayload | null): AddressFormValues {
  return {
    postalCode: address?.postalCode ?? "",
    street: address?.street ?? "",
    number: address?.number ?? "",
    complement: address?.complement ?? null,
    neighborhood: address?.neighborhood ?? "",
    city: address?.city ?? "",
    state: address?.state ?? "",
  };
}

const sameLocation = (a: AddressFormValues, b: AddressPayload) =>
  a.street === b.street &&
  a.number === b.number &&
  a.city === b.city &&
  a.state === b.state;

function AddressLocationForm({
  onSubmit,
  defaultValues,
}: AddressLocationProps) {
  const {
    register,
    handleSubmit,
    setValue,
    setFocus,
    control,
    formState: { errors },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: toFormValues(defaultValues),
  });
  const [postalCode, street, number, neighborhood, city, state] = useWatch({
    control,
    name: ["postalCode", "street", "number", "neighborhood", "city", "state"],
  });
  const cep = useCepLookup(postalCode);
  const geocode = useGeocode();
  const initialCep = useRef(defaultValues?.postalCode ?? "");

  useEffect(() => {
    if (!cep.data || postalCode === initialCep.current) return;

    const fill = (
      name: "street" | "neighborhood" | "city" | "state",
      value: string,
    ) =>
      setValue(name, value, {
        shouldDirty: true,
        shouldValidate: value !== "",
      });

    fill("street", cep.data.logradouro);
    fill("neighborhood", cep.data.bairro);
    fill("city", cep.data.localidade);
    fill("state", cep.data.uf);
    setFocus("number");
  }, [cep.data]);

  const submit = async (values: AddressFormValues) => {
    if (geocode.isPending) return;

    const coords =
      defaultValues && sameLocation(values, defaultValues)
        ? {
            latitude: defaultValues.latitude,
            longitude: defaultValues.longitude,
          }
        : await geocode.mutateAsync(values).catch(() => null);

    if (!coords) return;

    onSubmit({ ...values, ...coords });
  };

  return (
    <Stack
      component="form"
      id="address-form"
      noValidate
      spacing={2}
      onSubmit={handleSubmit(submit)}
    >
      <button type="submit" hidden />

      <Controller
        name="postalCode"
        control={control}
        render={({ field: { ref, name, value, onChange, onBlur } }) => (
          <TextField
            name={name}
            inputRef={ref}
            onBlur={onBlur}
            value={value}
            onChange={(e) => onChange(onlyDigits(e.target.value).slice(0, 8))}
            label="CEP"
            autoFocus
            autoComplete="postal-code"
            error={!!errors.postalCode || cep.isError}
            helperText={
              errors.postalCode?.message ??
              (cep.isError
                ? "CEP não encontrado. Confira os números."
                : undefined)
            }
            slotProps={{
              htmlInput: { inputMode: "numeric" },
              input: {
                endAdornment: cep.isFetching ? (
                  <InputAdornment position="end">
                    <CircularProgress size={16} />
                  </InputAdornment>
                ) : undefined,
              },
            }}
          />
        )}
      />

      <TextField
        {...register("street")}
        label="Rua"
        error={!!errors.street}
        helperText={errors.street?.message}
        slotProps={{ inputLabel: { shrink: !!street } }}
      />

      <Stack direction="row" spacing={2} sx={{ alignItems: "flex-start" }}>
        <Stack sx={{ flex: 1 }}>
          <TextField
            {...register("number")}
            label="Número"
            slotProps={{ input: { readOnly: number === "S/N" } }}
            error={!!errors.number}
            helperText={errors.number?.message}
          />
          <FormControlLabel
            label="Sem número"
            control={
              <Checkbox
                size="small"
                checked={number === "S/N"}
                onChange={(e) => {
                  setValue("number", e.target.checked ? "S/N" : "", {
                    shouldValidate: true,
                  });
                  if (!e.target.checked) setFocus("number");
                }}
              />
            }
          />
        </Stack>
        <TextField
          {...register("neighborhood")}
          label="Bairro"
          error={!!errors.neighborhood}
          helperText={errors.neighborhood?.message}
          slotProps={{ inputLabel: { shrink: !!neighborhood } }}
          sx={{ flex: 2 }}
        />
      </Stack>

      <TextField
        {...register("complement", {
          setValueAs: (v: string | null) => (v?.trim() ? v.trim() : null),
        })}
        label="Complemento (opcional)"
        error={!!errors.complement}
        helperText={errors.complement?.message}
      />

      <Stack direction="row" spacing={2}>
        <TextField
          {...register("city")}
          label="Cidade"
          error={!!errors.city}
          helperText={errors.city?.message}
          slotProps={{
            input: { readOnly: cep.isSuccess },
            inputLabel: { shrink: !!city },
          }}
          sx={{ flex: 2 }}
        />
        <TextField
          {...register("state")}
          label="Estado"
          error={!!errors.state}
          helperText={errors.state?.message}
          slotProps={{
            input: { readOnly: cep.isSuccess },
            inputLabel: { shrink: !!state },
          }}
          sx={{ flex: 1 }}
        />
      </Stack>

      {geocode.isPending && (
        <Alert severity="info" icon={<CircularProgress size={16} />}>
          Localizando endereço…
        </Alert>
      )}
      {geocode.isError && (
        <Alert severity="error">
          Não conseguimos localizar esse endereço no mapa. Confira rua, número e
          cidade e tente novamente.
        </Alert>
      )}
    </Stack>
  );
}

export default AddressLocationForm;
