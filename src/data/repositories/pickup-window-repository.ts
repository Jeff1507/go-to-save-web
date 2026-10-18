import { api } from "../../core/lib/api";
import type { PickupWindow } from "../models/pickup-window";

export async function listPickupWindows() {
  const windows = await api.get("pickup-presets").json<PickupWindow[]>();
  return windows;
}

export async function createPickupWindow(data: {
  name: string;
  start: string;
  end: string;
}) {
  await api.post("pickup-presets", { json: data });
}

export async function updatePickupWindow({
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

export async function deletePickupWindow(id: string) {
  await api.delete(`pickup-presets/${id}`);
}
