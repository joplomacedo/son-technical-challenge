<template>
	<div>
		<div :class="$style.cart">
			<div :class="$style.cart__grid">
				<div :class="$style.cart__main">
					<div class="space-y-8">
						<div>
							<p class="text-xl font-bold mb-4">Shopping Cart</p>

							<div
								v-if="cartStatus === 'pending'"
								class="space-y-4"
							>
								<BaseSkeleton
									v-for="i in 3"
									:key="i"
									class="mb-4"
									height="100px"
								/>
							</div>

							<div
								v-else-if="cartStatus === 'success'"
								class="space-y-8"
							>
								<CartList
									v-if="cart?.items.length"
									:items="cart.items"
								/>

								<CartEmptyCallToAction v-else />

								<CartDeletedListPanel v-if="deletedItems.length" />
							</div>
						</div>

						<div v-if="cartStatus === 'success' && cart?.items.length">
							<p class="text-xl font-bold mb-4">Shipping</p>

							<div
								v-if="shippingMethodsStatus === 'pending'"
								class="space-y-2"
							>
								<BaseSkeleton
									v-for="i in 3"
									:key="i"
									height="80px"
								/>
							</div>

							<CartShippingRadioGroup
								v-if="shippingMethodsStatus === 'success'"
								v-model="selectedShippingMethodId"
								:options="shippingMethods!"
								:eligible-options-ids="cart!.eligibleShippingMethodsIds"
							/>
						</div>
					</div>
				</div>

				<div
					v-if="cart?.items.length"
					:class="$style.cart__sideBar"
				>
					<CartPriceDetails class="mb-6" />

					<BaseButton
						v-tooltip="{
							content: isCheckoutEnabled.reason,
							disabled: isCheckoutEnabled.enabled,
						}"
						class="block w-full"
						:disabled="!isCheckoutEnabled.enabled"
						:loading="isCheckoutButtonLoading"
						@click="handleCheckoutButtonClick"
						>Checkout</BaseButton
					>
				</div>
			</div>

			<CartModalEmailForm
				v-if="isEmailModalFormOpen"
				@close="handlModalEmailFormClose"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
useSeoMeta({
	title: "FootFlare | Cart",
	description: "Your shopping cart",
	//TODO: og and twitter
});

const { user } = useUserStore();
const {
	selectedShippingMethodId,
	isCheckoutEnabled,
	deletedItems,
	cartQuery,
	shippingMethodsQuery,
} = useCartStore();

const { data: cart, status: cartStatus, suspense: cartSuspense } = cartQuery;

const {
	data: shippingMethods,
	status: shippingMethodsStatus,
	suspense: shippingMethodsSuspense,
} = shippingMethodsQuery;

const isEmailModalFormOpen = ref(false);

const isCheckoutButtonLoading = ref(false);

const handleCheckoutButtonClick = () => {
	if (!user.value.email) {
		isCheckoutButtonLoading.value = true;

		// intentional delay for ux purposes
		setTimeout(() => {
			isEmailModalFormOpen.value = true;
		}, 600);

		return;
	}

	navigateTo("/checkout");
};

function handlModalEmailFormClose() {
	if (user.value.email) {
		navigateTo("/checkout");
	} else {
		isCheckoutButtonLoading.value = false;
	}

	isEmailModalFormOpen.value = false;
}

// onServerPrefetch(async () => {
// 	await Promise.all([cartSuspense(), shippingMethodsSuspense()]);
// });
</script>

<style module>
.cart {
}
.cart__grid {
	display: grid;
	row-gap: theme("spacing.12");
}
.cart__main {
}
.cart__sideBar {
	position: sticky;
	bottom: 0;
	padding-block: theme("spacing.6");
	background-color: rgba(255, 255, 255, 0.9);
	backdrop-filter: blur(5px);
	border-top: 1px solid theme("colors.gray.200");
}

@media screen(lg) {
	.cart__grid {
		grid-template-columns: 1fr 360px;
		column-gap: theme("spacing.24");
		align-items: start;
	}

	.cart__sideBar {
		position: static;
		padding-block: 0;
		background-color: transparent;
		backdrop-filter: none;
		border-top: none;
	}
}
</style>
