import { API_BASE_URL } from "../core/lib/api";

export const resolveMediaUrl = (url: string | null) => {
  if (!url) return null;

  return `${API_BASE_URL}${url}`;
};
