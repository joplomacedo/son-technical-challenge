import {
	useCartQuery,
	useCartIsBusy,
	useAddItemMutation,
	useDeleteItemMutation,
	useUpdateItemMutation,
} from "~/queries/cart";
import { useShippingMethodsQuery } from "~/queries/shipping-methods";

import useDeletedItems from "./useDeletedItems";
import useIsCheckoutEnabled from "./useIsCheckoutEnabled";
import createContext from "~/libs/createContext";

export const useCartContext = createContext(function () {
	const cartQuery = useCartQuery();
	const addItemMutation = useAddItemMutation();
	const deleteItemMutation = useDeleteItemMutation();
	const updateItemMutation = useUpdateItemMutation();
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

	return {
		cartQuery,
		addItemMutation,
		deleteItemMutation,
		updateItemMutation,
		shippingMethodsQuery,
		selectedShippingMethodId,
		selectedShippingMethod,
		total,
		isCheckoutEnabled,
		deletedItems,
		isCartBusy,
	};
});
