import type { PickupPreset } from "../data/models/pickup-preset";

export const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

type PickupValues = {
  customPickup: boolean;
  presetId: string;
  customStart: string;
  customEnd: string;
};

export function buildPickupWindow(
  values: PickupValues,
  presets: PickupPreset[],
) {
  if (values.customPickup) {
    if (
      !TIME_REGEX.test(values.customStart) ||
      !TIME_REGEX.test(values.customEnd)
    ) {
      return null;
    }
    return { start: values.customStart, end: values.customEnd };
  }

  const preset = presets.find((p) => p.id === values.presetId);
  if (!preset) return null;

  return { start: preset.start, end: preset.end };
}
