<template>
	<div>
		<!-- <div
			v-if="isPagePending"
			class="grid place-content-center py-20"
		>
			<BaseSpinner />
		</div> -->

		<div v-if="isPageError"></div>

		<div v-else>
			<div class="grid lg:grid-cols-[1fr_360px] gap-x-24 gap-y-12 items-start">
				<div>
					<div class="grid gap-8">
						<div>
							<div class="mb-4 flex justify-between items-center">
								<p class="text-xl font-bold">Shopping Cart</p>
							</div>

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
								class="grid gap-8"
							>
								<CartList
									v-if="cart?.items.length"
									:items="cart!.items"
								/>

								<CartEmpty v-if="!cart?.items.length" />

								<div v-if="deletedItems.length">
									<div class="mb-4">
										<span
											@click="() => (isDeletedItemsOpen = !isDeletedItemsOpen)"
											class="underline cursor-pointer text-sm"
										>
											{{
												isDeletedItemsOpen
													? "Hide deleted items"
													: "See deleted items"
											}}

											<span> ({{ deletedItems.length }}) </span>
										</span>
									</div>

									<div v-if="isDeletedItemsOpen">
										<CartDeletedList :items="deletedItems" />
									</div>
								</div>
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
								:options="shippingMethods!"
								:eligibleOptionsIds="cart!.eligibleShippingMethodsIds"
								v-model="selectedShippingMethodId"
							/>
						</div>
					</div>
				</div>

				<div
					class="grid gap-5"
					v-if="cart?.items.length"
				>
					<CartPriceDetails />

					<BaseButton
						class="block w-full"
						v-tooltip="{
							content: isCheckoutEnabled.reason,
							disabled: isCheckoutEnabled.enabled,
						}"
						:disabled="!isCheckoutEnabled.enabled"
						:loading="isCheckoutButtonLoading"
						@click="handleCheckoutButtonClick"
						>Checkout</BaseButton
					>
				</div>
			</div>

			<CartModalEmail
				v-if="isEmailModalOpen"
				@close="handleCartModalEmailClose"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useCartQuery } from "~/queries/cart";
import { useShippingMethodsQuery } from "~/queries/shipping-methods";

useSeoMeta({
	title: "FootFlare | Cart",
	description: "Your shopping cart",
	//TODO: og and twitter
});

const user = useUser();

const { selectedShippingMethodId } = useCartSelectedShippingMethod();
const { isCheckoutEnabled } = useCartIsCheckoutEnabled();
const { deletedItems } = useCartDeletedItems();

const { data: cart, status: cartStatus } = useCartQuery();

const { data: shippingMethods, status: shippingMethodsStatus } =
	useShippingMethodsQuery();

const isEmailModalOpen = ref(false);
const isDeletedItemsOpen = ref(false);

watch(deletedItems, (deletedItems) => {
	if (!deletedItems.length) {
		isDeletedItemsOpen.value = false;
	}
});

const isCheckoutButtonLoading = ref(false);

const handleCheckoutButtonClick = () => {
	isCheckoutButtonLoading.value = true;

	setTimeout(() => {
		if (!user.value.email) {
			isEmailModalOpen.value = true;
		} else {
			alert("Move to checkout!");
			setTimeout(() => {
				window.location.reload();
			}, 300);
		}
	}, 600);
};

function handleCartModalEmailClose() {
	if (user.value.email) {
		alert("Move to checkout!");
	} else {
		isCheckoutButtonLoading.value = false;
	}

	isEmailModalOpen.value = false;
}

const criticalComponents = [cartStatus, shippingMethodsStatus];

const isPagePending = computed(() =>
	criticalComponents.some((status) => status.value === "pending")
);

const isPageReady = computed(() =>
	criticalComponents.every((status) => status.value === "success")
);

const isPageError = computed(() =>
	criticalComponents.some((status) => status.value === "error")
);
</script>

<style module></style>
