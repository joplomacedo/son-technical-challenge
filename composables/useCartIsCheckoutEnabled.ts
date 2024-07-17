import { useCartQuery } from "~/queries/cart";

export default function useCartIsCheckoutEnabled() {
	const { data: cart } = useCartQuery();
	const { selectedShippingMethodId } = useCartSelectedShippingMethod();
	const { isCartBusy } = useCartIsBusy();

	const isCheckoutEnabled = computed(() => {
		if (!cart.value) {
			return {
				enabled: false,
				reason: "Cart is not loaded",
			};
		}

		if (cart.value.items.length === 0) {
			return {
				enabled: false,
				reason: "Cart is empty",
			};
		}

		if (isNil(selectedShippingMethodId.value)) {
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

	return { isCheckoutEnabled };
}
