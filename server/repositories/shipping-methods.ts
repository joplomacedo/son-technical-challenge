import createRepository from "~/server/libs/createRepository";
import type { RepoId } from "~/server/libs/createRepository";

type RepoShippingMethod = {
	id: RepoId;
	name: string;
	description: string;
	price: number;
	eligibility: {
		minOrderTotalPrice: number;
	};
};

const shippingMethodsRepo = createRepository<RepoShippingMethod>();
shippingMethodsRepo.addMany([
	{
		id: "1",
		name: "Standard Shipping",
		price: 5,
		description: "Delivered within 5-7 business days",
		eligibility: {
			minOrderTotalPrice: 0,
		},
	},
	{
		id: "2",
		name: "Express Shipping",
		price: 10,
		description: "Delivered within 2-3 business days",
		eligibility: {
			minOrderTotalPrice: 90,
		},
	},
	{
		id: "3",
		name: "Free Shipping",
		price: 0,
		description: "Delivered within 2-3 business days",
		eligibility: {
			minOrderTotalPrice: 200,
		},
	},
]);

export default shippingMethodsRepo;
export type { RepoShippingMethod };
