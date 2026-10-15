import ky from "ky";
import { useQuery } from "@tanstack/react-query";
import { onlyDigits } from "../../utils/cnpj";

type ViaCepResponse = {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
};

export function useCepLookup(postalCode: string) {
  const cep = onlyDigits(postalCode);

  return useQuery({
    queryKey: ["cep", cep],
    queryFn: async () => {
      const data = await ky
        .get(`https://viacep.com.br/ws/${cep}/json/`)
        .json<ViaCepResponse>();
      if (data.erro) throw new Error("CEP não encontrado");
      return data;
    },
    enabled: cep.length === 8,
    staleTime: Infinity,
    retry: false,
  });
}
