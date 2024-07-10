<template>
	<li :class="$style.root">
		<div :class="$style.imageBox">
			<NuxtImg
				:src="item.product.thumbnail"
				:alt="item.product.name"
				:class="$style.image"
				:width="imgSize"
				:height="imgSize"
				:placeholder="[imgSize, imgSize, 75, 5]"
				:placeholder-class="$style['is-placeholder']"
				fit="cover"
			/>
		</div>

		<div :class="$style.content">
			<div>
				<p :class="$style.name">{{ item.product.name }}</p>
				<p :class="$style.price">{{ $formatPrice(item.product.price) }}</p>

				<div :class="$style.quantityAndActions">
					<p :class="$style.quantity">x {{ item.quantity }}</p>
				</div>
			</div>

			<BaseButton
				@click="() => addItem(item.quantity)"
				:disabled="isCartBusy"
				:class="$style.restoreBtn"
				size="xs"
				:loading="addItemStatus === 'pending'"
			>
				Add to cart
			</BaseButton>
		</div>
	</li>
</template>

<script setup lang="ts">
import { useAddItemMutation } from "@/queries/cart";
import type { CartItem } from "@/queries/cart";

const { isCartBusy } = useCartIsBusy();

const props = defineProps<{
	item: CartItem;
}>();

const { mutate: addItem, status: addItemStatus } = useAddItemMutation(
	props.item.id
);

const imgSize = 100;
const imgSizeWithUnit = `${imgSize}px`;
</script>

<style module>
.root {
	display: flex;
	gap: theme("spacing.4");
}

.imageBox {
	--size: v-bind(imgSizeWithUnit);
	width: var(--size);
	height: var(--size);

	border-radius: theme("borderRadius.md");
	background-color: theme("colors.gray.100");
	overflow: hidden;
	flex-shrink: 0;
	padding: theme("spacing.4");
}

.image {
	transition: filter 0.3s;

	&.is-placeholder {
		filter: blur(5px);
	}
}

.content {
	padding-block: theme("spacing.2");
	display: flex;
	justify-content: space-between;
	flex-grow: 1;
	flex-wrap: wrap;
}

.name {
	font-weight: theme("fontWeight.semibold");
}

.price {
}

.restoreBtn {
	align-self: flex-start;
}
</style>
