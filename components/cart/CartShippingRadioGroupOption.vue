<template>
	<div
		v-tooltip="{
			content: 'Cart does not qualify for this shipping method.',
			disabled: !disabled,
		}"
		:class="[$style.root, { [$style['is-disabled']]: disabled }]"
		@click="handleClick"
	>
		<BaseFormRadio
			v-model="model"
			:value="option.id"
			:disabled="disabled"
			@click.stop
		/>

		<div :class="$style.content">
			<p :class="$style.name">{{ option.name }}</p>
			<div :class="$style.price">{{ $formatPrice(option.price) }}</div>
			<p>{{ option.description }}</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { ShippingMethod } from "@/queries/shipping-methods";

const props = withDefaults(
	defineProps<{
		option: ShippingMethod;
		disabled?: boolean;
	}>(),
	{
		disabled: false,
	}
);

//TODO revisit this id type
const model = defineModel<string | null>();

function handleClick() {
	if (props.disabled) return;
	model.value = props.option.id;
}
</script>

<style module>
.root {
	display: flex;
	padding: theme("spacing.4");
	gap: theme("spacing.4");
	border-radius: theme("borderRadius.md");
	border: 1px solid theme("colors.gray.200");
	cursor: pointer;

	&.is-disabled {
		opacity: 0.5;
	}
}

.root:has(:checked) {
	background-color: theme("colors.gray.100");
	border-color: theme("colors.primary.500");
}

.content {
	flex-grow: 1;
	display: grid;
	grid-template-columns: 1fr auto;
	column-gap: theme("spacing.2");
}

@media (max-width: 450px) {
	.content {
		grid-template-columns: 1fr;
	}
}

.name {
	font-weight: theme("fontWeight.semibold");
}

.price {
	font-weight: theme("fontWeight.semibold");
}
</style>
