import { useCartQuery, useCartIsBusy } from "~/queries/cart";
import { useShippingMethodsQuery } from "~/queries/shipping-methods";

import useDeletedItems from "./useDeletedItems";
import useIsCheckoutEnabled from "./useIsCheckoutEnabled";

export const useCartStore = createSharedComposable(function () {
	const cartQuery = useCartQuery();
	const isCartBusy = useCartIsBusy();
	const shippingMethodsQuery = useShippingMethodsQuery();

	const { data: cart } = cartQuery;
	const { data: shippingMethods } = shippingMethodsQuery;

	const deletedItems = useDeletedItems(cart);
	const selectedShippingMethodId = ref<string | null>(null);

	const isCheckoutEnabled = useIsCheckoutEnabled({
		isCartBusy,
		cart,
		shippingMethodId: selectedShippingMethodId,
	});

	watch(selectedShippingMethodId, (newVal, oldVal) => {
		console.log("selectedShippingMethodId changed", newVal, oldVal);
	});

	watchEffect(() => {
		if (!selectedShippingMethodId.value) {
			return;
		}

		if (
			!cart.value?.eligibleShippingMethodsIds?.includes(
				selectedShippingMethodId.value
			)
		) {
			selectedShippingMethodId.value = null;
		}
	});

	const selectedShippingMethod = computed(() => {
		if (isNil(selectedShippingMethodId.value)) {
			return null;
		}

		return (
			shippingMethods.value?.find(
				(method) => method.id === selectedShippingMethodId.value
			) ?? null
		);
	});

	const total = computed(() => {
		return cart.value
			? cart.value.subtotal + (selectedShippingMethod.value?.price ?? 0)
			: null;
	});

	const reset = () => {
		selectedShippingMethodId.value = null;
	};

	return {
		cartQuery,
		shippingMethodsQuery,
		selectedShippingMethodId,
		selectedShippingMethod,
		total,
		isCheckoutEnabled,
		deletedItems,
		isCartBusy,
		reset,
	};
});
