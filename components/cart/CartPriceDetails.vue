<template>
	<div :class="$style.root">
		<div :class="$style.priceItems">
			<div :class="$style.priceItem">
				<p>Subtotal</p>
				<p :class="$style.priceItem__value">
					<Transition name="scale">
						<BaseSpinner
							v-if="isCartBusy"
							size="sm"
						/>
					</Transition>

					{{ $formatPrice(cart?.subtotal) }}
				</p>
			</div>
			<div :class="$style.priceItem">
				<p>Shipping Cost</p>
				<p :class="$style.priceItem__value">
					{{
						!isNil(selectedShippingMethod)
							? $formatPrice(selectedShippingMethod.price)
							: "—"
					}}
				</p>
			</div>
			<div :class="$style.priceItem">
				<p>Total</p>
				<p :class="$style.priceItem__value">
					{{ $formatPrice(cartTotal) }}
				</p>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useCartQuery } from "~/queries/cart";
import { useShippingMethodsQuery } from "~/queries/shipping-methods";

const { data: cart } = useCartQuery();
const { data: shippingMethods } = useShippingMethodsQuery();
const { selectedShippingMethod } = useCartSelectedShippingMethod();
const { isCartBusy } = useCartIsBusy();

const cartTotal = computed(() => {
	if (!cart.value || !shippingMethods.value) {
		return null;
	}

	if (!selectedShippingMethod.value) {
		return cart.value.subtotal;
	}

	return cart.value.subtotal + selectedShippingMethod.value.price;
});
</script>

<style module>
.priceItems > * + * {
	margin-top: theme("spacing.1");
}

.priceItem {
	display: flex;
	justify-content: space-between;
}

.priceItem__value {
	display: flex;
	align-items: center;
	gap: theme("spacing.2");
	font-weight: theme("fontWeight.semibold");
}
</style>
