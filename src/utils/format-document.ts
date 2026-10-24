import { onlyDigits } from "./cnpj";

export const formatCnpj = (cnpj: string) =>
  onlyDigits(cnpj).replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    "$1.$2.$3/$4-$5",
  );

export const formatCep = (cep: string) =>
  onlyDigits(cep).replace(/^(\d{5})(\d{3})$/, "$1-$2");
