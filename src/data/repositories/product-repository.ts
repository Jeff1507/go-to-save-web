import { api } from "../../core/lib/api";
import type { Product } from "../models/product";

export async function listProducts() {
  const products = await api.get("products").json<Product[]>();
  return products;
}

export async function createProduct(data: {
  name: string;
  image: File | null;
}) {
  const formData = new FormData();
  formData.append("name", data.name);
  if (data.image) formData.append("image", data.image);

  await api.post("products", { body: formData });
}

export async function updateProduct({
  id,
  ...data
}: {
  id: string;
  name: string;
  image: File | null;
  removeImage: boolean;
}) {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("removeImage", data.removeImage.toString());
  if (data.image) formData.append("image", data.image);

  await api.put(`products/${id}`, { body: formData });
}

export async function deleteProduct(id: string) {
  await api.delete(`products/${id}`);
}
