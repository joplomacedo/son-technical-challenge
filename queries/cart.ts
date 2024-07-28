const STATUS_CODES = {
	useUpdateItemMutation: {
		invalidQuantity: 422,
	},
} as const;

const useCartIsBusy = () => {
	const cartQuery = useCartQuery();
	const totalCartMutations = useIsMutating({
		mutationKey: useCartQueryKeys().cart(),
	});

	const isCartBusy = computed(() => {
		return cartQuery.isFetching.value || totalCartMutations.value > 0;
	});

	return isCartBusy;
};

const useCartQueryKeys = () => {
	const { user } = useUserStore();

	const userKeyUnit = useState("user-key", () => ({
		id: user.value.id,
		currency: user.value.currency,
	}));

	watch(user, () => {
		userKeyUnit.value = {
			id: user.value.id,
			currency: user.value.currency,
		};
	});

	const queryKeys = {
		cart: () => [userKeyUnit, "cart"] as const,
		updateItem: () => [...queryKeys.cart(), "update"] as const,
		deleteItem: () => [...queryKeys.cart(), "delete"] as const,
		addItem: () => [...queryKeys.cart(), "add"] as const,
	};

	return queryKeys;
};

function useCartQuery() {
	const { user } = useUserStore();

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

function useUpdateItemMutation() {
	const queryClient = useQueryClient();
	const { user } = useUserStore();
	const queryKeys = useCartQueryKeys();
	const cartQueryKey = queryKeys.cart();
	const updateItemQueryKey = queryKeys.updateItem();

	return useMutation({
		mutationKey: updateItemQueryKey,
		mutationFn: ({
			productId,
			quantity,
		}: {
			productId: string;
			quantity: number;
		}) =>
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
			const { productId } = variables;

			if (
				error.statusCode === STATUS_CODES.useUpdateItemMutation.invalidQuantity
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

function useDeleteItemMutation() {
	const { user } = useUserStore();
	const queryClient = useQueryClient();
	const queryKeys = useCartQueryKeys();
	const cartQueryKey = queryKeys.cart();
	const deleteItemQueryKey = queryKeys.deleteItem();

	return useMutation({
		mutationKey: deleteItemQueryKey,
		mutationFn: ({ productId }: { productId: string }) =>
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

function useAddItemMutation() {
	const queryClient = useQueryClient();
	const { user } = useUserStore();
	const queryKeys = useCartQueryKeys();
	const cartQueryKey = queryKeys.cart();
	const addItemQueryKey = queryKeys.addItem();

	return useMutation({
		mutationKey: addItemQueryKey,
		mutationFn: ({
			quantity,
			productId,
			safe = false,
		}: {
			quantity: number;
			productId: string;
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

type UpdateItemMutation = ReturnType<typeof useUpdateItemMutation>;
type DeleteItemMutation = ReturnType<typeof useDeleteItemMutation>;
type AddItemMutation = ReturnType<typeof useAddItemMutation>;

export {
	useCartQuery,
	useUpdateItemMutation,
	useDeleteItemMutation,
	useAddItemMutation,
	useCartQueryKeys,
	useCartIsBusy,
	STATUS_CODES,
};

export type {
	CartQuery,
	Cart,
	CartItem,
	UpdateItemMutation,
	DeleteItemMutation,
	AddItemMutation,
};
