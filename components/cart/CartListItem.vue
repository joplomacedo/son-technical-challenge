<template>
	<li
		:class="[
			$style.root,
			{
				[$style['is-requestingChanges']]: isRequestingQuantityChange,
				[$style['is-invalidQuantityWarningVisible']]:
					isInvalidQuantityWarningVisible,
				[$style['is-itemMutating']]: isItemMutating,
				[$style['is-cartBusy']]: isCartBusy,
			},
		]"
	>
		<div :class="$style.main">
			<div :class="$style.imageBox">
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
			</div>
			<div :class="$style.content">
				<div>
					<p :class="$style.name">{{ item.product.name }}</p>
					<p :class="$style.price">{{ $formatPrice(item.product.price) }}</p>
				</div>

				<div :class="$style.quantityAndActions">
					<div :class="$style.actions">
						<BaseButton
							@click="deleteItem"
							:class="$style.removeBtn"
							:disabled="isCartBusy"
							size="xs"
							shape="circle"
						>
							<BaseIcon name="Trash" />
						</BaseButton>

						<div :class="$style.quantityActions">
							<BaseButton
								@click="() => handleQuantityInc(-1)"
								:class="$style.quantityBtn"
								:disabled="isCartBusy || requestedQuantity < 1"
								size="xs"
								shape="circle"
							>
								<BaseIcon name="Minus" />
							</BaseButton>
							<BaseButton
								@click="() => handleQuantityInc(1)"
								:class="$style.quantityBtn"
								:disabled="isCartBusy"
								size="xs"
								shape="circle"
							>
								<BaseIcon name="Plus" />
							</BaseButton>
						</div>
					</div>

					<p :class="$style.quantity">
						{{ item.quantity }}
					</p>

					<Transition name="scale-up">
						<div
							:class="$style.requestedChanges"
							v-if="isRequestingQuantityChange"
						>
							<BaseIcon name="ArrowLongRight" />

							<span :class="$style.requestedChanges__quantity">{{
								requestedQuantity
							}}</span>
						</div>
					</Transition>

					<Transition name="scale-up">
						<BaseSpinner
							v-if="isItemMutating"
							size="sm"
						/>
					</Transition>
				</div>
			</div>
		</div>

		<div
			:class="$style.invalidQuantityWarning"
			v-if="isInvalidQuantityWarningVisible"
		>
			<BaseIcon
				:class="$style.invalidQuantityWarning__icon"
				name="ExclamationTriangle"
			/>

			<div :class="$style.invalidQuantityWarning__content">
				<span>
					There {{ stockQuantity === 1 ? "is" : "are" }} just
					{{ stockQuantity }} {{ stockQuantity === 1 ? "item" : "items" }} in
					stock.
				</span>

				<div :class="$style.invalidQuantityWarning__actions">
					<button
						v-if="props.item.quantity !== stockQuantity"
						@click="() => handleQuantityUpdate(stockQuantity)"
						:class="$style.invalidQuantityWarning__actionBtn"
					>
						Update to {{ stockQuantity }}
					</button>
					<button
						@click="cancelQuantityUpdate"
						:class="$style.invalidQuantityWarning__actionBtn"
					>
						Cancel update
					</button>
				</div>
			</div>
		</div>
	</li>
</template>

<script setup lang="ts">
import type { CartItem } from "@/queries/cart";
import { useUpdateItemMutation, useDeleteItemMutation } from "~/queries/cart";

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

const requestedQuantity = ref(props.item.quantity);

const stockQuantity = computed(() => {
	return props.item.product.stockQuantity;
});

const shouldConsiderStockQuantity = ref(false);

const isRequestingQuantityChange = computed(() => {
	return requestedQuantity.value !== props.item.quantity;
});

const isSavedQuantityValid = computed(() => {
	return props.item.quantity <= stockQuantity.value;
});

const isRequestedQuantityValid = computed(() => {
	return requestedQuantity.value <= stockQuantity.value;
});

const isInvalidQuantityWarningVisible = computed(() => {
	return (
		shouldConsiderStockQuantity.value &&
		(!isSavedQuantityValid.value || !isRequestedQuantityValid.value)
	);
});

const statusCodes = {
	invalidQuantity: 422,
};

function updateItemQuantity(quantity: number) {
	return updateItemQuantityMutate(quantity, {
		onError(error) {
			if (error.data.statusCode === statusCodes.invalidQuantity) {
				shouldConsiderStockQuantity.value = true;
			}
		},
		onSuccess: (data) => {
			const item = data.items.find(
				(item) => item.productId === props.item.productId
			);

			if (!item) {
				return;
			}

			shouldConsiderStockQuantity.value = false;
			requestedQuantity.value = item.quantity;
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

const isHandleQuantityClick = ref(false);

const handleQuantityInc = (inc: number) => {
	isHandleQuantityClick.value = true;
	setTimeout(() => {
		isHandleQuantityClick.value = false;
	});

	const newQty = requestedQuantity.value + inc;
	requestedQuantity.value = newQty;

	if (newQty === props.item.quantity) {
		debouncedUpdate.cancel();
	} else {
		debouncedUpdate(newQty);
	}
};

function handleQuantityUpdate(newQuantity: number) {
	requestedQuantity.value = newQuantity;

	if (newQuantity !== props.item.quantity) {
		debouncedUpdate(newQuantity);
	}
}

function cancelQuantityUpdate() {
	requestedQuantity.value = props.item.quantity;
	shouldConsiderStockQuantity.value = false;
}

const activityEvents = ["click", "keydown"];

const flushOnUnrelatedActivity = () => {
	if (isHandleQuantityClick.value) {
		return;
	}

	debouncedUpdate.flush();
};

onMounted(() => {
	activityEvents.forEach((event) => {
		document.addEventListener(event, flushOnUnrelatedActivity);
	});
});

onUnmounted(() => {
	activityEvents.forEach((event) => {
		document.removeEventListener(event, flushOnUnrelatedActivity);
	});
});

onMounted(() => {
	if (props.item.quantity > stockQuantity.value) {
		shouldConsiderStockQuantity.value = true;
	}
});
</script>

<style module>
.root {
	--size-img: v-bind(imgSizeWithUnit);
}

.main {
	display: flex;
	gap: theme("spacing.4");
}

.imageBox {
	width: var(--size-img);
	height: var(--size-img);

	border-radius: theme("borderRadius.md");
	background-color: theme("colors.gray.100");
	overflow: hidden;
	padding: theme("spacing.4");
	flex-shrink: 0;
}

.image {
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
