import { removeCartItem, cartToDTO } from "@/server/services/carts";
import { parse, object, string, optional, union, null as vNull } from "valibot";

const bodySchema = object({
	id: string(),
	item: object({
		productId: string(),
	}),
	currency: optional(union([string(), vNull()])),
});

export default defineEventHandler(async (event) => {
	const { item, currency, id } = await readValidatedBody(event, (data) =>
		parse(bodySchema, data)
	);

	try {
		const cart = removeCartItem(id, {
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
