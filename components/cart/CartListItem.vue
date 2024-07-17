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
						<div :class="$style.stepper">
							<BaseButton
								:class="$style.stepper__btn"
								size="xs"
								shape="circle"
								@click="handleQuantityInc(-1)"
								:disabled="isCartBusy || displayQuantity < 1"
							>
								<BaseIcon name="Minus" />
							</BaseButton>
							<div :class="$style.stepper__value">
								{{ displayQuantity }}
							</div>
							<BaseButton
								:class="$style.stepper__btn"
								size="xs"
								shape="circle"
								@click="handleQuantityInc(1)"
								:disabled="isCartBusy"
							>
								<BaseIcon name="Plus" />
							</BaseButton>
						</div>

						<BaseSpinner
							size="sm"
							v-if="isItemMutating"
						/>

						<Transition name="slide-left">
							<div
								v-if="isStockVisible"
								:class="$style.stockWarning"
							>
								<template v-if="stockQuantity > 0">
									<span>Only {{ stockQuantity }} left!</span>

									<!-- TODO: create underline button variant -->
									<button
										:class="$style.stockWarning__updateBtn"
										class="underline cursor-pointer"
										@click="() => updateItemQuantity(stockQuantity)"
										v-if="stockQuantity !== item.quantity"
									>
										Update to {{ stockQuantity }}
									</button>
								</template>

								<span v-else>Out of stock</span>
							</div>
						</Transition>
					</div>

					<BaseButton
						:disabled="isCartBusy"
						size="xs"
						shape="circle"
						color="secondary"
						@click="deleteItem"
					>
						<BaseIcon name="Trash" />
					</BaseButton>
				</div>
			</div>
		</div>
	</li>
</template>

<script setup lang="ts">
import type { CartItem } from "@/queries/cart";
import {
	useUpdateItemMutation,
	useDeleteItemMutation,
	statusCodes,
} from "~/queries/cart";
const props = defineProps<{
	item: CartItem;
}>();

const imgSize = 100;
const imgSizeWithUnit = `${imgSize}px`;

const {
	error: updateItemQuantityError,
	mutate: updateItemQuantityMutate,
	status: updateItemQuantityStatus,
} = useUpdateItemMutation(props.item.productId);

const {
	error: deleteItemError,
	mutate: deleteItem,
	status: deleteItemStatus,
} = useDeleteItemMutation(props.item.productId);

const { isCartBusy } = useCartIsBusy();

const isItemMutating = computed(() => {
	return [updateItemQuantityStatus, deleteItemStatus].some(
		(status) => status.value === "pending"
	);
});

const displayQuantity = ref<number>(props.item.quantity);

watch(
	() => props.item.quantity,
	(newValue) => {
		displayQuantity.value = newValue;
	}
);

const stockQuantity = computed(() => {
	return props.item.product.stockQuantity;
});

const isCartQuantityValid = computed(() => {
	return stockQuantity.value >= props.item.quantity;
});

const isStockVisible = computed(() => {
	return (
		!isCartQuantityValid.value ||
		updateItemQuantityError.value?.data.statusCode ===
			statusCodes.useUpdateItemMutation.invalidQuantity
	);
});

function updateItemQuantity(quantity: number) {
	return updateItemQuantityMutate(quantity, {
		onError(error) {
			if (
				error.data.statusCode ===
				statusCodes.useUpdateItemMutation.invalidQuantity
			) {
				displayQuantity.value = props.item.quantity;
			}
		},
	});
}

const debouncedUpdate = debounce((newQuantity) => {
	if (newQuantity < 1) {
		deleteItem();
	} else {
		updateItemQuantity(newQuantity);
	}
}, 800);

const handleQuantityClick = timeoutFlag();

const handleQuantityInc = (inc: number) => {
	handleQuantityClick.flag();

	displayQuantity.value += inc;

	if (displayQuantity.value === props.item.quantity) {
		debouncedUpdate.cancel();
	} else {
		debouncedUpdate(displayQuantity.value);
	}
};

const flushOnUnrelatedClick = () => {
	if (handleQuantityClick.flagged()) {
		return;
	}

	debouncedUpdate.flush();
};

useEventListener(document.documentElement, "click", flushOnUnrelatedClick);
</script>

<style module>
.main {
	display: flex;
	gap: theme("spacing.4");
}

.name {
	font-weight: theme("fontWeight.semibold");
}

.stepper {
	display: flex;
	align-items: center;
}

/* TODO: current solution can break if more than 2 digits */
.stepper__value {
	width: 2.2em;
	text-align: center;
	font-variant-numeric: tabular-nums;
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

.stockWarning {
	display: flex;
	gap: theme("spacing.2");
	font-size: theme("fontSize.xs");
	background-color: theme("colors.warning.100");
	color: theme("colors.warning.800");
	padding: theme("spacing.1") theme("spacing.2");
	border-radius: theme("borderRadius.md");
}

.stockWarning__updateBtn {
	text-decoration: underline;
	cursor: pointer;
}

@media screen and (max-width: 640px) {
	.image {
		--size-img: 75px;
	}

	.stockWarning__updateBtn {
		display: none;
	}
}
</style>
