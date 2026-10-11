export type PublicMenuItem = {
  id: string;
  name: string;
  description: string;
  category: string;
  priceCentavos: number;
  image: string | null;
  isAvailable: boolean;
  isFeatured: boolean;
  flavorOptions: string[];
  requiredFlavorCount: number;
};

export type PublicBranch = {
  id: string;
  name: string;
  address: string;
  city: string;
  province: string | null;
  businessHours: string | null;
  phone: string | null;
  email: string | null;
  directionsUrl: string;
  facebookUrl: string | null;
};

export type PublicList<T> = {
  data: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
  options: string[];
};
