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
					{{ $formatPrice(total) }}
				</p>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useCartQuery, useCartIsBusy } from "~/queries/cart";

const { data: cart } = useCartQuery();
const isCartBusy = useCartIsBusy();
const { total, selectedShippingMethod } = useCartStore();
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
