function useShippingMethodsQuery() {
	return useQuery({
		queryFn: () => {
			return $fetch(`/api/shipping-methods/get-all`);
		},
		queryKey: ["shipping-methods"],
	});
}

type ShippingMethodsQuery = ReturnType<typeof useShippingMethodsQuery>;
type ShippingMethod = Exclude<
	ShippingMethodsQuery["data"]["value"],
	undefined
>[number];

export { useShippingMethodsQuery };
export type { ShippingMethodsQuery, ShippingMethod };
