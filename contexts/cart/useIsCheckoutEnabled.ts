import type { Cart } from "~/queries/cart";

export default function useIsCheckoutEnabled({
	isCartBusy,
	cart,
	shippingMethodId,
}: {
	isCartBusy: Ref<boolean>;
	cart: Ref<Cart | undefined>;
	shippingMethodId: Ref<string | null>;
}) {
	const isCheckoutEnabled = computed(() => {
		if (!cart.value) {
			return {
				enabled: false,
				reason: "Cart is not loaded",
			};
		}

		if (!cart.value.items.length) {
			return {
				enabled: false,
				reason: "Cart is empty",
			};
		}

		if (isNil(shippingMethodId.value)) {
			return {
				enabled: false,
				reason: "Shipping method is not selected",
			};
		}

		if (isCartBusy.value) {
			return {
				enabled: false,
				reason: "Cart is refreshing",
			};
		}

		const isItemsQuantityValid = cart.value?.items.every(
			(item) => item.quantity <= item.product.stockQuantity
		);

		if (!isItemsQuantityValid) {
			return {
				enabled: false,
				reason: "Cart contains items with invalid quantity",
			};
		}

		return {
			enabled: true,
		};
	});

	return isCheckoutEnabled;
}
