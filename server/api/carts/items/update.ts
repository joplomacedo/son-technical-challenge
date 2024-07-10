import { updateCartItemQuantity, cartToDTO } from "@/server/services/carts";

import {
	parse,
	object,
	string,
	number,
	optional,
	union,
	null as vNull,
} from "valibot";

const bodySchema = object({
	id: string(),
	item: object({
		productId: string(),
		quantity: number(),
	}),
	currency: optional(union([string(), vNull()])),
});

export default defineEventHandler(async (event) => {
	const { id, item, currency } = await readValidatedBody(event, (data) =>
		parse(bodySchema, data)
	);

	try {
		const cart = updateCartItemQuantity(id, {
			item,
		});

		return cartToDTO({
			cart,
			currency,
		});
	} catch (error) {
		throw createError(toNuxtError(error));
	}
});
