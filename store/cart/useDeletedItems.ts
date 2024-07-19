import type { Cart, CartItem } from "~/queries/cart";

export default function useDeletedItems(cart: Ref<Cart | undefined>) {
	const deletedItems = ref<CartItem[]>([]);

	watch(cart, (newCart, oldCart) => {
		if (!newCart) return;

		let newDeletedItems: CartItem[] = [...deletedItems.value];

		oldCart?.items.forEach((oldItem) => {
			const isItemDeleted = !newCart.items.some(
				(newItem) => newItem.productId === oldItem.productId
			);

			if (isItemDeleted) {
				newDeletedItems.push(oldItem);
			}
		});

		newCart.items.forEach((newItem) => {
			const isItemRestored = !oldCart?.items.some(
				(oldItem) => oldItem.productId === newItem.productId
			);

			if (isItemRestored) {
				newDeletedItems = newDeletedItems.filter(
					(deletedItem) => deletedItem.productId !== newItem.productId
				);
			}
		});

		deletedItems.value = newDeletedItems;
	});

	onUnmounted(() => {
		deletedItems.value = [];
	});

	watch(
		() => cart.value?.id,
		() => {
			deletedItems.value = [];
		}
	);

	return deletedItems;
}
