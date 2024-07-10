import createRepository from "~/server/libs/createRepository";
import type { RepoId } from "~/server/libs/createRepository";

type RepoProduct = {
	id: RepoId;
	name: string;
	price: number;
	description: string;
	images: string[];
	thumbnail: string;
	stockQuantity: number;
};

const productsRepo = createRepository<RepoProduct>();

productsRepo.addMany([
	{
		id: "1",
		name: "Nike Air Max 90",
		price: 97,
		description:
			"The Nike Air Max 90 is a classic sneaker that has been released in many different colorways.",
		images: ["img/product/1/image-1.webp", "img/product/1/image-2.webp"],
		thumbnail: "img/product/1/thumbnail.webp",
		stockQuantity: 15,
	},
	{
		id: "2",
		name: "Reebok Classic",
		price: 119,
		description:
			"The Reebok Classic is a low-top sneaker that was first released in 1983.",
		images: ["img/product/2/image-1.webp", "img/product/2/image-2.webp"],
		thumbnail: "img/product/2/thumbnail.webp",
		stockQuantity: 10,
	},
	{
		id: "3",
		name: "Adidas Superstar",
		price: 67,
		description:
			"The Adidas Superstar is a low-top basketball shoe that was first released in 1969. It features a rubber shell toe and a herringbone-pattern outsole.",
		images: ["img/product/3/image-1.webp", "img/product/3/image-2.webp"],
		thumbnail: "img/product/3/thumbnail.webp",
		stockQuantity: 8,
	},
]);

export default productsRepo;
export type { RepoProduct };
