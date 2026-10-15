import { api } from "../../core/lib/api";
import type { User } from "../models/user";

export async function getProfile() {
  const user = await api.get("me").json<User>();
  return user;
}
