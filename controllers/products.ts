import { Product } from "models/product";

export async function getProductByID(productId: string): Promise<any> {
  const res = Product.getProductByObjectID(productId);

  return res;
}
