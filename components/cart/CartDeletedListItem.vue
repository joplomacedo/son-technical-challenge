<template>
	<li :class="$style.root">
		<div :class="$style.main">
			<NuxtImg
				:class="$style.image"
				:src="item.product.thumbnail"
				:alt="item.product.name"
				:width="imgSize"
				:height="imgSize"
				:placeholder="[imgSize, imgSize, 75, 5]"
				:placeholder-class="$style['is-placeholder']"
				fit="cover"
			/>
			<div class="flex-grow flex flex-col justify-between py-2">
				<div class="flex justify-between items-start">
					<div>
						<p :class="$style.name">{{ item.product.name }}</p>
						<p :class="$style.price">{{ $formatPrice(item.product.price) }}</p>
					</div>

					<p :class="$style.priceTotal">{{ $formatPrice(item.total) }}</p>
				</div>

				<div class="flex justify-between gap-2">
					<div class="flex gap-4 items-center">
						<span>
							{{ item.quantity }}
						</span>

						<BaseSpinner
							size="sm"
							v-if="addItemStatus === 'pending'"
						/>
					</div>

					<BaseButton
						:class="$style.stepper__btn"
						size="xs"
						@click="() => handleAddToCart(item.quantity)"
						:disabled="isCartBusy"
					>
						Add to cart
					</BaseButton>
				</div>
			</div>
		</div>
	</li>
</template>

<script setup lang="ts">
/* TODO: figure best way to share code with CartListItem */
import type { CartItem } from "@/queries/cart";
import { useAddItemMutation } from "~/queries/cart";
const props = defineProps<{
	item: CartItem;
}>();

const imgSize = 100;
const imgSizeWithUnit = `${imgSize}px`;

const { mutate: addItem, status: addItemStatus } = useAddItemMutation(
	props.item.id
);

const { isCartBusy } = useCartIsBusy();

const handleAddToCart = (quantity: number) => {
	addItem({ quantity, safe: true });
};
</script>

<style module>
.main {
	display: flex;
	gap: theme("spacing.4");
}

.name {
	font-weight: theme("fontWeight.semibold");
}

.image {
	--size-img: v-bind(imgSizeWithUnit);
	width: var(--size-img);
	height: var(--size-img);
	border-radius: theme("borderRadius.md");
	background-color: theme("colors.gray.100");
	padding: theme("spacing.4");
	flex-shrink: 0;
	transition: filter 0.3s;

	&.is-placeholder {
		filter: blur(5px);
	}
}

.content {
	padding-block: theme("spacing.2");
}

.name {
	font-weight: theme("fontWeight.semibold");
}

.price {
	color: theme("colors.gray.500");
}

.priceTotal {
	font-weight: theme("fontWeight.semibold");
}

@media screen and (max-width: 640px) {
	.image {
		--size-img: 75px;
	}
}
</style>
