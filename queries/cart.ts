const statusCodes = {
	useUpdateItemMutation: {
		invalidQuantity: 422,
	},
} as const;

//there must be a better way to do this
// lock etc, etc etc
function useCartBaseQueryKey() {
	const user = useUser();
	const userKeyUnit = computed(() => ({
		id: user.value.id,
		currency: user.value.currency,
	}));

	return [userKeyUnit, "cart"] as const;
}

function lockCartBaseQueryKey(
	queryKey: ReturnType<typeof useCartBaseQueryKey>
) {
	const [userKeyUnit, cartKeyUnit] = queryKey;

	return [
		{
			userId: userKeyUnit.value.id,
			currency: userKeyUnit.value.currency,
		},
		cartKeyUnit,
	];
}

function useCartQuery() {
	const user = useUser();
	const cartBaseQueryKey = useCartBaseQueryKey();

	return useQuery({
		queryKey: [...cartBaseQueryKey],
		queryFn: ({ signal }) => {
			return $fetch(`/api/carts/get`, {
				method: "post",
				body: {
					id: user.value.id,
					currency: user.value.currency,
				},
				signal,
			});
		},
	});
}

function useUpdateItemMutation(productId: string) {
	const queryClient = useQueryClient();
	const user = useUser();
	const cartBaseQueryKey = useCartBaseQueryKey();

	return useMutation({
		mutationKey: [...cartBaseQueryKey, "items", productId, "update"],
		mutationFn: (quantity: number) =>
			$fetch("/api/carts/items/update", {
				method: "post",
				body: {
					id: user.value.id,
					currency: user.value.currency,
					item: {
						productId,
						quantity,
					},
				},
			}),

		onMutate() {
			queryClient.cancelQueries({ queryKey: cartBaseQueryKey });

			return {
				lockedCartBaseQueryKey: lockCartBaseQueryKey(cartBaseQueryKey),
			};
		},

		onError({ data: error }: any, variables, context) {
			if (!context) return;

			const { lockedCartBaseQueryKey } = context;

			if (
				error.statusCode === statusCodes.useUpdateItemMutation.invalidQuantity
			) {
				queryClient.setQueryData(lockedCartBaseQueryKey, (cart: Cart) => {
					return {
						...cart,
						items: cart.items.map((item) => {
							if (item.productId === productId) {
								return {
									...item,
									product: {
										...item.product,
										stockQuantity: error.data.stockQuantity,
									},
								};
							}

							return item;
						}),
					};
				});
			}
		},

		onSuccess: (cart) => {
			queryClient.setQueryData(cartBaseQueryKey, cart);
		},
	});
}

function useDeleteItemMutation(productId: string) {
	const queryClient = useQueryClient();
	const cartBaseQueryKey = useCartBaseQueryKey();
	const user = useUser();

	return useMutation({
		mutationKey: [...cartBaseQueryKey, "items", productId, "delete"],
		mutationFn: () =>
			$fetch("/api/carts/items/delete", {
				method: "post",
				body: {
					id: user.value.id,
					currency: user.value.currency,
					item: {
						productId,
					},
				},
			}),
		onMutate() {
			queryClient.cancelQueries({ queryKey: cartBaseQueryKey });

			return {
				lockedCartBaseQueryKey: lockCartBaseQueryKey(cartBaseQueryKey),
			};
		},

		onSuccess: (cart, variables, { lockedCartBaseQueryKey }) => {
			queryClient.setQueryData(lockedCartBaseQueryKey, cart);
		},
	});
}

function useAddItemMutation(productId: string) {
	const queryClient = useQueryClient();
	const cartBaseQueryKey = useCartBaseQueryKey();
	const user = useUser();

	return useMutation({
		mutationKey: [...cartBaseQueryKey, "items", productId, "add"],
		mutationFn: ({
			quantity,
			safe = false,
		}: {
			quantity: number;
			safe?: boolean;
		}) =>
			$fetch("/api/carts/items/add", {
				method: "post",
				body: {
					id: user.value.id,
					currency: user.value.currency,
					item: {
						productId,
						quantity,
					},
					safe,
				},
			}),

		onMutate() {
			queryClient.cancelQueries({ queryKey: cartBaseQueryKey });

			return {
				lockedCartBaseQueryKey: lockCartBaseQueryKey(cartBaseQueryKey),
			};
		},

		onSuccess: (cart, variables, { lockedCartBaseQueryKey }) => {
			queryClient.setQueryData(lockedCartBaseQueryKey, cart);
		},
	});
}

type CartQuery = ReturnType<typeof useCartQuery>;
type Cart = Exclude<CartQuery["data"]["value"], undefined>;
type CartItem = Cart["items"][number];

type UpdateItemQuantityMutation = ReturnType<typeof useUpdateItemMutation>;
type DeleteItemMutation = ReturnType<typeof useDeleteItemMutation>;
type AddItemMutation = ReturnType<typeof useAddItemMutation>;

export {
	useCartQuery,
	useUpdateItemMutation,
	useDeleteItemMutation,
	useAddItemMutation,
	statusCodes,
};

export type {
	CartQuery,
	Cart,
	CartItem,
	UpdateItemQuantityMutation,
	DeleteItemMutation,
	AddItemMutation,
};
