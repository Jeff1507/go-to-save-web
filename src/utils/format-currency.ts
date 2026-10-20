// A API trabalha com valores em centavos (Ex: 2000 = R$ 20,00)
const formatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export const formatCurrency = (cents: number) => formatter.format(cents / 100);
