import productsRepo from "~/server/repositories/products";
import type { RepoProduct } from "~/server/repositories/products";

function getProducts(): RepoProduct[] {
	return productsRepo.getAll();
}

function getProduct(id: string): RepoProduct {
	return productsRepo.get(id);
}

export { getProducts, getProduct };
