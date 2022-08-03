import { Product } from "models/product";

export async function getProductByID(productId: string): Promise<any> {
  const res = Product.getProductByObjectID(productId);

  return res;
}

export async function getProductsTotal(): Promise<any> {
  const res = Product.countAllProducts()

  return res;
}

export async function getProducts(wordToSearch: string, finalOffset: number, finalLimit: number): Promise<any> {
  const res = Product.getProducts(wordToSearch, finalOffset, finalLimit)

  return res;
}

