<template>
	<li :class="[$style.root, {}]">
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
			<div>
				<p :class="$style.name">{{ item.product.name }}</p>
				<p :class="$style.price">{{ $formatPrice(item.product.price) }}</p>

				<div
					:class="[
						$style.stepper,
						{
							[$style['is-invalid']]: !isDisplayQuantityValid,
						},
					]"
				>
					<BaseButton
						:class="$style.stepper__btn"
						@click="handleQuantityInc(-1)"
						:disabled="isCartBusy || displayQuantity < 1"
					>
						<BaseIcon name="Minus" />
					</BaseButton>
					<div :class="[$style.stepper__value]">
						{{ displayQuantity }}
					</div>
					<BaseButton
						:class="$style.stepper__btn"
						@click="handleQuantityInc(1)"
						:disabled="isCartBusy"
					>
						<BaseIcon name="Plus" />
					</BaseButton>
				</div>

				<div v-if="isStockVisible">
					<div>Only {{ stockQuantity }} left</div>
					<div v-if="stockQuantity !== item.quantity">
						<span @click="() => updateItemQuantity(stockQuantity)"
							>Update to {{ stockQuantity }}</span
						>
					</div>
				</div>

				<BaseButton
					:disabled="isCartBusy"
					@click="deleteItem"
				>
					<BaseIcon name="Trash" />
				</BaseButton>

				<BaseSpinner v-if="isItemMutating" />

				<p>{{ $formatPrice(item.total) }}</p>
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

const isDisplayQuantityValid = computed(() => {
	return stockQuantity.value >= displayQuantity.value;
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
.root {
	--size-img: v-bind(imgSizeWithUnit);
}

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
.stepper__btn {
}
.stepper__value {
	width: 2.2em;
	text-align: center;
}

.stepper.is-invalid {
	.stepper__value {
	}
}

.image {
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

.quantityAndActions {
	display: flex;
	align-items: center;
	gap: theme("spacing.6");
}

.requestedChanges {
	display: flex;
	align-items: center;
	gap: theme("spacing.2");
	background: theme("colors.primary.50");
	padding: 0 theme("spacing.2");
	border-radius: theme("borderRadius.md");
	font-size: theme("fontSize.sm");
}

.actions {
	gap: theme("spacing.3");
	display: flex;
	align-items: center;
}
.quantityActions {
	display: flex;
	align-items: center;
	gap: theme("spacing.1");
}

.invalidQuantityWarning {
	--background-color: theme("colors.yellow.100");
	position: relative;
	background-color: var(--background-color);
	color: theme("colors.yellow.800");
	padding: theme("spacing.2") theme("spacing.4");
	border-radius: 0 0 theme("borderRadius.md") theme("borderRadius.md");
	font-size: theme("fontSize.sm");
	display: flex;
	align-items: flex-start;

	gap: theme("spacing.1");

	&:after {
		content: "";
		display: block;
		border: 5px solid transparent;
		border-bottom-color: var(--background-color);
		position: absolute;
		bottom: 100%;
		left: calc(var(--size-img) / 2);
		transform: translateX(-50%);
	}
}

.invalidQuantityWarning__icon {
	margin-top: 4px;
}
.invalidQuantityWarning__content {
	flex-grow: 1;
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
}

.invalidQuantityWarning__actions {
	display: flex;
	gap: theme("spacing.3");
	flex-wrap: wrap;
}

.invalidQuantityWarning__actionBtn {
	cursor: pointer;
	text-decoration: underline;
}

.root.is-invalidQuantityWarningVisible {
	.main {
		background-color: theme("colors.gray.50");
		padding: theme("spacing.4");
	}
}
</style>
