import shippingMethodsRepo from "~/server/repositories/shipping-methods";
import type { RepoShippingMethod } from "~/server/repositories/shipping-methods";

function isShippingMethodEligible(
	shippingMethod: RepoShippingMethod,
	{ subtotal }: { subtotal: number }
): boolean {
	return shippingMethod.eligibility.minOrderTotalPrice <= subtotal;
}

function getAllShippingMethods(): RepoShippingMethod[] {
	return shippingMethodsRepo.getAll();
}

function getShippingMethod(id: string): RepoShippingMethod | null {
	return shippingMethodsRepo.get(id);
}

function getEligibleShippingMethods({
	subtotal,
}: {
	subtotal: number;
}): RepoShippingMethod[] {
	return shippingMethodsRepo
		.getAll()
		.filter((shippingMethod) =>
			isShippingMethodEligible(shippingMethod, { subtotal })
		);
}

export { getAllShippingMethods, getEligibleShippingMethods, getShippingMethod };
