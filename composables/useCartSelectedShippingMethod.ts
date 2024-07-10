import { useCartQuery } from "~/queries/cart";
import { useShippingMethodsQuery } from "~/queries/shipping-methods";

export default function () {
	const { data: cart } = useCartQuery();
	const { data: shippingMethods } = useShippingMethodsQuery();

	const selectedShippingMethodId = useState<string | null>(
		"selectedShippingMethodId",
		() => null
	);

	watch(cart, () => {
		if (!selectedShippingMethodId.value) {
			return;
		}

		if (
			!cart.value?.eligibleShippingMethodsIds.includes(
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

	return {
		selectedShippingMethodId,
		selectedShippingMethod,
	};
}
