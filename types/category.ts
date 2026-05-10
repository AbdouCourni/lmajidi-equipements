export interface Category {
  id: string;

  name: string;
  slug: string;

  image?: string;
  description?: string;

  parentId?: string | null;

  level: "main" | "sub";

  createdAt?: string;
  updatedAt?: string;
}