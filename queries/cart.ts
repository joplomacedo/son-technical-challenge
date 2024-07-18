const statusCodes = {
	useUpdateItemMutation: {
		invalidQuantity: 422,
	},
} as const;

const useCartQueryKeys = () => {
	const user = useUser();
	const userKeyUnit = computed(() => ({
		id: user.value.id,
		currency: user.value.currency,
	}));

	const queryKeys = {
		cart: () => [userKeyUnit, "cart"],
		updateItem: (productId: string) => [
			...queryKeys.cart(),
			productId,
			"update",
		],
		deleteItem: (productId: string) => [
			...queryKeys.cart(),
			productId,
			"delete",
		],
		addItem: (productId: string) => [...queryKeys.cart(), productId, "add"],
	};

	return queryKeys;
};

function useCartQuery() {
	const user = useUser();

	return useQuery({
		queryKey: useCartQueryKeys().cart(),
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
	const queryKeys = useCartQueryKeys();
	const cartQueryKey = queryKeys.cart();
	const updateItemQueryKey = queryKeys.updateItem(productId);

	return useMutation({
		mutationKey: updateItemQueryKey,
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
			queryClient.cancelQueries({ queryKey: cartQueryKey });

			return {
				lockedCartQueryKey: readonly(cartQueryKey),
			};
		},

		onError({ data: error }: any, variables, context) {
			if (!context) return;

			const { lockedCartQueryKey } = context;

			if (
				error.statusCode === statusCodes.useUpdateItemMutation.invalidQuantity
			) {
				queryClient.setQueryData(lockedCartQueryKey, (cart: Cart) => {
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

		onSuccess: (cart, variables, { lockedCartQueryKey }) => {
			queryClient.setQueryData(lockedCartQueryKey, cart);
		},
	});
}

function useDeleteItemMutation(productId: string) {
	const user = useUser();
	const queryClient = useQueryClient();
	const queryKeys = useCartQueryKeys();
	const cartQueryKey = queryKeys.cart();
	const deleteItemQueryKey = queryKeys.deleteItem(productId);

	return useMutation({
		mutationKey: deleteItemQueryKey,
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
			queryClient.cancelQueries({ queryKey: cartQueryKey });

			return {
				lockedCartQueryKey: readonly(cartQueryKey),
			};
		},

		onSuccess: (cart, variables, { lockedCartQueryKey }) => {
			queryClient.setQueryData(lockedCartQueryKey, cart);
		},
	});
}

function useAddItemMutation(productId: string) {
	const queryClient = useQueryClient();
	const user = useUser();
	const queryKeys = useCartQueryKeys();
	const cartQueryKey = queryKeys.cart();
	const addItemQueryKey = queryKeys.addItem(productId);

	return useMutation({
		mutationKey: addItemQueryKey,
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
			queryClient.cancelQueries({ queryKey: cartQueryKey });

			return {
				lockedCartQueryKey: readonly(cartQueryKey),
			};
		},

		onSuccess: (cart, variables, { lockedCartQueryKey }) => {
			queryClient.setQueryData(lockedCartQueryKey, cart);
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
	useCartQueryKeys,
};

export type {
	CartQuery,
	Cart,
	CartItem,
	UpdateItemQuantityMutation,
	DeleteItemMutation,
	AddItemMutation,
};
