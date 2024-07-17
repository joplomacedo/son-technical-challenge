import cartsRepo from "~/server/repositories/carts";

import type { RepoId } from "~/server/libs/createRepository";
import type { RepoCart, RepoCartItem } from "~/server/repositories/carts";
import type { RepoProduct } from "~/server/repositories/products";

import { getEligibleShippingMethods } from "@/server/services/shipping-methods";

import { getProduct } from "~/server/services/products";
import {
	NotFoundError,
	OperationError,
	UnprocessableError,
} from "@/server/operation-errors";

import { UpdateManyResult } from "@/server/operation-results";

function getCart(cartId: RepoId): RepoCart {
	return cartsRepo.get(cartId);
}

function emptyCart(cartId: RepoId): RepoCart {
	const newCart = cartsRepo.updatePartial(cartId, { items: [] });
	return newCart;
}

type UpdateCartItemQuantityPayload = {
	item: {
		productId: RepoId;
		quantity: number;
	};
};

function updateCartItemQuantity(
	cartId: RepoId,
	{ item: { productId, quantity } }: UpdateCartItemQuantityPayload
): RepoCart {
	const cart = cartsRepo.get(cartId);
	const itemIdx = cart.items.findIndex((item) => item.productId === productId);

	if (itemIdx === -1) {
		throw new NotFoundError("Cannot find item with productId: " + productId);
	}

	if (quantity <= 0) {
		return removeCartItem(cart.id, { item: { productId } });
	}

	const product = getProduct(productId)!;

	if (product.stockQuantity < quantity) {
		throw new UnprocessableError("Requested quantity exceeds stock quantity", {
			stockQuantity: product.stockQuantity,
			requestedQuantity: quantity,
		});
	}

	const newItems = [...cart.items];

	newItems[itemIdx] = {
		...newItems[itemIdx],
		requestedQuantity: quantity,
		quantity,
	};

	const newCart = cartsRepo.updatePartial(cart.id, {
		items: newItems,
	});

	return newCart;
}

type UpdateManyCartItemQuantityPayload = {
	items: UpdateCartItemQuantityPayload["item"][];
};

function updateManyCartItemQuantity(
	cartId: RepoId,
	{ items }: UpdateManyCartItemQuantityPayload
): { cart: RepoCart; updateResults: UpdateManyResult } {
	let cart = cartsRepo.get(cartId);
	let updateResults: UpdateManyResult = [];

	for (const item of items) {
		try {
			cart = updateCartItemQuantity(cartId, { item });

			updateResults.push({
				id: item.productId,
				success: true,
			});
		} catch (error: any) {
			updateResults.push({
				id: item.productId,
				success: false,
				error:
					error instanceof OperationError
						? error
						: new OperationError({ srcError: error }),
			});
		}
	}

	return {
		cart,
		updateResults,
	};
}

type RemoveCartItemPayload = {
	item: {
		productId: RepoId;
	};
};

function removeCartItem(
	cartId: RepoId,
	{ item: { productId } }: RemoveCartItemPayload
): RepoCart {
	const cart = cartsRepo.get(cartId);
	const newCart = cartsRepo.updatePartial(cart.id, {
		items: cart.items.filter((item) => item.productId !== productId),
	});

	return newCart;
}

type AddCartItemPayload = {
	item: {
		productId: RepoId;
		quantity: number;
	};
};

function addCartItem(
	cartId: RepoId,
	{ item: { productId, quantity } }: AddCartItemPayload,
	safe: boolean = false
): RepoCart {
	const cart = cartsRepo.get(cartId);
	const product = getProduct(productId);

	if (!safe) {
		if (product.stockQuantity < quantity) {
			throw new UnprocessableError(
				"Requested quantity exceeds stock quantity",
				{
					stockQuantity: product.stockQuantity,
					requestedQuantity: quantity,
				}
			);
		}
	} else {
		quantity = Math.min(product.stockQuantity, quantity);
	}

	const newDbCartItem = {
		quantity: quantity,
		requestedQuantity: quantity,
		productId: productId,
		id: productId,
	};

	const newCart = cartsRepo.updatePartial(cart.id, {
		items: [...cart.items, newDbCartItem],
	});

	return newCart;
}

type DTOCart = Omit<RepoCart, "items"> & {
	items: DTOCartItem[];
	eligibleShippingMethodsIds: RepoId[];
	subtotal: number;
	currency: string;
};

type DTOCartItem = RepoCartItem & {
	product: DTOProductPreview;
	total: number;
};

type DTOProductPreview = Pick<
	RepoProduct,
	"id" | "name" | "price" | "thumbnail" | "stockQuantity"
>;

function cartToDTO({
	cart,
	currency,
}: {
	cart: RepoCart;
	currency?: string | null;
}): DTOCart {
	currency ??= "USD";

	const items = cart.items.map(cartItemToDTO);
	const subtotal = calculateItemsSubtotal(cart.items);

	// currency conversion would be done here perhaps

	const eligibleShippingMethodsIds = getEligibleShippingMethods({
		subtotal,
	}).map(({ id }) => id);

	return {
		...cart,
		items,
		eligibleShippingMethodsIds,
		subtotal: subtotal,
		currency,
	};
}

function cartItemToDTO(cartItem: RepoCartItem): DTOCartItem {
	const product = getProduct(cartItem.productId);

	return {
		...cartItem,
		product: {
			id: product.id,
			name: product.name,
			price: product.price,
			thumbnail: product.thumbnail,
			stockQuantity: product.stockQuantity,
		},
		total: product.price * cartItem.quantity,
	};
}

function calculateItemsSubtotal(cartItems: RepoCartItem[]): number {
	return cartItems.reduce((acc, item) => {
		const product = getProduct(item.productId);
		return acc + product.price * item.quantity;
	}, 0);
}

export {
	getCart,
	emptyCart,
	updateCartItemQuantity,
	updateManyCartItemQuantity,
	removeCartItem,
	addCartItem,
	cartToDTO,
};
