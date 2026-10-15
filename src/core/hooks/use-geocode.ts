import ky from "ky";
import { useMutation } from "@tanstack/react-query";

type NominatimResult = { lat: string; lon: string };

type GeocodeInput = {
  street: string;
  number: string;
  city: string;
  state: string;
};

async function search(q: string) {
  const results = await ky
    .get("https://nominatim.openstreetmap.org/search", {
      searchParams: { q, format: "jsonv2", limit: 1, countrycodes: "br" },
    })
    .json<NominatimResult[]>();

  return results[0] ?? null;
}

export function useGeocode() {
  return useMutation({
    mutationFn: async ({ street, number, city, state }: GeocodeInput) => {
      const region = [city, state, "Brasil"];

      const hasNumber = /\d/.test(number);

      const result =
        (hasNumber
          ? await search([`${street}, ${number}`, ...region].join(", "))
          : null) ?? (await search([street, ...region].join(", ")));

      if (!result) throw new Error("Endereço não encontrado");

      return {
        latitude: Number(result.lat),
        longitude: Number(result.lon),
      };
    },
  });
}
