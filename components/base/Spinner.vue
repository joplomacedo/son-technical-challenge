<template>
	<div :class="$style.spinner"></div>
</template>

<script setup lang="ts">
const props = withDefaults(
	defineProps<{
		size?: number | "sm" | "md" | "lg";
		color?: "primary" | "secondary" | "white";
	}>(),
	{
		size: "md",
		color: "primary",
	}
);

const sizeCssVar = computed(() => {
	return (
		{
			sm: "15px",
			md: "30px",
			lg: "45px",
		}[props.size] ?? props.size + "px"
	);
});

const colorCssVar = computed(() => {
	return `var(--color-${props.color})`;
});
</script>

<style module>
.spinner {
	--size: v-bind(sizeCssVar);
	--color-primary: theme("colors.primary.500");
	--color-secondary: theme("colors.pink.500");
	--color-white: theme("colors.white");
	height: var(--size);
	width: var(--size);
	border-radius: 50%;
	border: calc(0.16 * var(--size)) solid;
	border-color: v-bind(colorCssVar) transparent;
	animation: spinnerAnim 1s infinite;
}
@keyframes spinnerAnim {
	to {
		transform: rotate(0.5turn);
	}
}
</style>
