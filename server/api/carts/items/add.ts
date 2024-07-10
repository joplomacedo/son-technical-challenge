import { addCartItem, cartToDTO } from "@/server/services/carts";
import {
	parse,
	object,
	string,
	number,
	pipe,
	optional,
	minValue,
	null as vNull,
	union,
} from "valibot";

const bodySchema = object({
	id: string(),
	item: object({
		productId: string(),
		quantity: pipe(number(), minValue(1)),
	}),
	currency: optional(union([string(), vNull()])),
});

export default defineEventHandler(async (event) => {
	const { id, item, currency } = await readValidatedBody(event, (data) =>
		parse(bodySchema, data)
	);

	try {
		const cart = addCartItem(id, {
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
