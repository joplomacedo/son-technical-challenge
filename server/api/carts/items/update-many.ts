import { updateManyCartItemQuantity, cartToDTO } from "@/server/services/carts";

import {
	parse,
	object,
	string,
	number,
	optional,
	union,
	array,
	null as vNull,
} from "valibot";

const bodySchema = object({
	id: string(),
	items: array(
		object({
			productId: string(),
			quantity: number(),
		})
	),
	currency: optional(union([string(), vNull()])),
});

export default defineEventHandler(async (event) => {
	const { id, items, currency } = await readValidatedBody(event, (data) =>
		parse(bodySchema, data)
	);

	try {
		const { cart, updateResults } = updateManyCartItemQuantity(id, {
			items,
		});

		return {
			updateResults,
			cart: cartToDTO({
				cart,
				currency,
			}),
		};
	} catch (error) {
		throw createError(toNuxtError(error));
	}
});
