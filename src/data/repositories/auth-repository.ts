import { api } from "../../core/lib/api";

export async function signupUser(data: {
  email: string;
  name: string;
  cnpj: string;
  password: string;
  address: {
    postalCode: string;
    street: string;
    number: string;
    neighborhood: string;
    complement: string | null;
    city: string;
    state: string;
    latitude: number;
    longitude: number;
  };
}) {
  await api.post("signup", { json: data });
}

export async function loginUser(data: { email: string; password: string }) {
  await api.post("login", { json: data });
}

export async function logoutUser() {
  await api.post("logout");
}

export async function logoutUserFromAll() {
  await api.post("logout-all");
}

export async function requestPasswordReset(data: { email: string }) {
  await api.post("password-reset", { json: data });
}

export async function resetPassword(data: {
  email: string;
  code: string;
  newPassword: string;
}) {
  await api.patch("reset-password", { json: data });
}

export async function requestEmailVerification(email: string) {
  await api.post("email-verification", { json: { email } });
}

export async function verifyEmail(data: { email: string; code: string }) {
  await api.patch("verify-email", { json: data });
}
