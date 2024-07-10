import createRepository from "~/server/libs/createRepository";
import type { RepoId } from "~/server/libs/createRepository";

type RepoCart = {
	userId: RepoId;
	id: RepoId;
	items: RepoCartItem[];
};

type RepoCartItem = {
	quantity: number;
	requestedQuantity: number;
	productId: RepoId;
	id: RepoId;
};

const cartsRepo = createRepository<RepoCart>();
cartsRepo.addMany([
	{
		userId: "1",
		id: "1",
		items: [
			{
				productId: "1",
				id: "1",
				quantity: 3,
				requestedQuantity: 3,
			},
			{
				productId: "2",
				id: "2",
				quantity: 2,
				requestedQuantity: 2,
			},
			{
				productId: "3",
				id: "3",
				quantity: 1,
				requestedQuantity: 1,
			},
		],
	},
]);

export default cartsRepo;
export type { RepoCart, RepoCartItem };
