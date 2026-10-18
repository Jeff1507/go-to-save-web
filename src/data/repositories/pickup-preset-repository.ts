import { api } from "../../core/lib/api";
import type { PickupPreset } from "../models/pickup-preset";

export async function listPickupPresets() {
  const presets = await api.get("pickup-presets").json<PickupPreset[]>();
  return presets;
}

export async function createPickupPreset(data: {
  name: string;
  start: string;
  end: string;
}) {
  await api.post("pickup-presets", { json: data });
}

export async function updatePickupPreset({
  id,
  ...data
}: {
  id: string;
  name: string;
  start: string;
  end: string;
}) {
  await api.put(`pickup-presets/${id}`, { json: data });
}

export async function deletePickupPreset(id: string) {
  await api.delete(`pickup-presets/${id}`);
}
