import { useCartQuery, useCartQueryKeys } from "~/queries/cart";

export default createSharedComposable(function () {
	const cartQuery = useCartQuery();
	const cartQueryKeys = useCartQueryKeys();

	const { isRefetching: isRefetchingCart } = cartQuery;

	const totalCartMutations = useIsMutating({
		mutationKey: cartQueryKeys.cart(),
	});

	const isCartBusy = computed(() => {
		return isRefetchingCart.value || totalCartMutations.value > 0;
	});

	return {
		isCartBusy,
	};
});
