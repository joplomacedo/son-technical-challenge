import { getAllShippingMethods } from "@/server/services/shipping-methods";
import toNuxtError from "~/server/utils/toNuxtError";

export default defineEventHandler(async () => {
	try {
		return getAllShippingMethods();
	} catch (error) {
		throw createError(toNuxtError(error));
	}
});
