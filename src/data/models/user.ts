export type User = {
  id: string;
  email: string;
  name: string;
  cnpj: string;
  avatarUrl: string | null;
  description: string | null;
  verifiedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  rating: {
    average: number;
    count: number;
  };
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
};
