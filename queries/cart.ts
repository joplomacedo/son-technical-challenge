const statusCodes = {
	useUpdateItemMutation: {
		invalidQuantity: 422,
	},
} as const;

function useCartQuery() {
	const user = useUser();
	const cartQueryKey = [user.value.id, "cart"];

	return useQuery({
		queryKey: cartQueryKey,
		queryFn: () => {
			return $fetch(`/api/carts/get`, {
				method: "post",
				body: {
					id: user.value.id,
					currency: user.value.currency,
				},
			});
		},
	});
}

function useUpdateItemMutation(productId: string) {
	const queryClient = useQueryClient();
	const user = useUser();

	return useMutation({
		mutationKey: [user.value.id, "cart", "items", productId, "update"],
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
			queryClient.cancelQueries({ queryKey: [user.value.id, "cart"] });
		},

		onError({ data: error }: any) {
			if (
				error.statusCode === statusCodes.useUpdateItemMutation.invalidQuantity
			) {
				queryClient.setQueryData([user.value.id, "cart"], (cart: Cart) => {
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
			queryClient.setQueryData([user.value.id, "cart"], cart);
			// queryClient.invalidateQueries({ queryKey: [user.value.id, "cart"] });
		},
	});
}

function useDeleteItemMutation(productId: string) {
	const queryClient = useQueryClient();
	const user = useUser();

	return useMutation({
		mutationKey: [user.value.id, "cart", "items", productId, "delete"],
		mutationFn: () => {
			return $fetch("/api/carts/items/delete", {
				method: "post",
				body: {
					id: user.value.id,
					currency: user.value.currency,
					item: {
						productId,
					},
				},
			});
		},
		onMutate() {
			queryClient.cancelQueries({ queryKey: [user.value.id, "cart"] });
		},

		onSuccess: (cart) => {
			queryClient.setQueryData([user.value.id, "cart"], cart);
			// queryClient.invalidateQueries({ queryKey: [user.value.id, "cart"] });
		},
	});
}

function useAddItemMutation(productId: string) {
	const queryClient = useQueryClient();
	const user = useUser();

	return useMutation({
		mutationKey: [user.value.id, "cart", "items", productId, "add"],
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
			queryClient.cancelQueries({ queryKey: [user.value.id, "cart"] });
		},

		onSuccess: (cart) => {
			queryClient.setQueryData([user.value.id, "cart"], cart);
			// queryClient.invalidateQueries({ queryKey: [user.value.id, "cart"] });
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
