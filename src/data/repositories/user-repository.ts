import { api } from "../../core/lib/api";
import type { User } from "../models/user";

export async function getProfile() {
  const user = await api.get("me").json<User>();
  return user;
}

export async function updateAvatar(avatar: File) {
  const formData = new FormData();
  formData.append("avatar", avatar);

  await api.put("me/avatar", { body: formData });
}

export async function removeAvatar() {
  await api.delete("me/avatar");
}

export async function updateProfile(data: {
  name: string;
  description: string | null;
}) {
  await api.patch("me", { json: data });
}

export async function updateAddress(address: {
  postalCode: string;
  street: string;
  number: string;
  neighborhood: string;
  complement: string | null;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
}) {
  await api.patch("me/address", { json: { address } });
}

export async function updateEmail(email: string) {
  await api.patch("me/email", { json: { email } });
}

export async function updatePassword(data: {
  password: string;
  newPassword: string;
}) {
  await api.patch("me/password", { json: data });
}
