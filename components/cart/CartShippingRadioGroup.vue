<template>
	<div :class="$style.root">
		<CartShippingRadioGroupOption
			v-for="option in options"
			:key="option.id"
			:option="option"
			v-model="model"
			:disabled="!isOptionEnabled(option.id)"
		/>
	</div>
</template>

<script setup lang="ts">
import type { Cart } from "@/queries/cart";
import type { ShippingMethod } from "@/queries/shipping-methods";

const props = defineProps<{
	options: ShippingMethod[];
	eligibleOptionsIds: Cart["eligibleShippingMethodsIds"];
}>();

//TODO revisit the id/string types below
const model = defineModel<string | null>();

const isOptionEnabled = (optionId: string) =>
	props.eligibleOptionsIds.includes(optionId);
</script>

<style module>
.root > * + * {
	margin-top: theme("spacing.1");
}
</style>
