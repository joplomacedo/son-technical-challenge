<template>
	<label :class="[$style.root, attrsClass]">
		<input
			v-model="model"
			:class="$style.input"
			v-bind="attrsRest"
			:value="value"
			type="radio"
		/>
		<span :class="$style.radio" />

		<span :class="$style.label">
			<slot>
				{{ label }}
			</slot>
		</span>
	</label>
</template>

<script setup lang="ts">
defineOptions({
	inheritAttrs: false,
});

defineProps<{
	label?: string;
	value: string;
}>();

const model = defineModel();

const { class: attrsClass, ...attrsRest } = useAttrs();
</script>

<style module>
.root {
	display: inline-block;
	cursor: pointer;
}

.input {
	display: none;
}

.radio {
	--background-color: #fff;
	--size: theme("spacing.5");
	background-color: var(--background-color);
	width: var(--size);
	height: var(--size);
	border-radius: 50%;
	display: block;
	border: 1px solid theme("colors.gray.300");
	display: inline-grid;
	place-content: center;

	&:before {
		content: "";
		display: block;
		width: calc(var(--size) / 3);
		height: calc(var(--size) / 3);
		border-radius: 50%;
		background-color: var(--background-color);
	}
}

.input:checked + .radio {
	background-color: theme("colors.primary.500");
}
</style>
