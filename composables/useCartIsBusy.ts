import { useCartQuery } from "~/queries/cart";

export default function useCart() {
	const cartQuery = useCartQuery();
	const user = useUser();

	const { isRefetching: isRefetchingCart } = cartQuery;

	const totalCartMutations = useIsMutating({
		mutationKey: [user.value.id, "cart"],
	});

	const isCartBusy = computed(() => {
		return isRefetchingCart.value || totalCartMutations.value > 0;
	});

	return {
		isCartBusy,
	};
}
