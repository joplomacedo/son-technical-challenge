<template>
	<div :class="$style.skeleton"/>
</template>

<script setup lang="ts">
withDefaults(
	defineProps<{
		width?: string | number;
		height: string | number;
	}>(),
	{
		width: "auto",
	}
);
</script>

<style module>
.skeleton {
	height: v-bind(height);
	width: v-bind(width);
	background-color: theme("colors.gray.100");
	border-radius: theme("borderRadius.md");
	animation: animation 1s infinite linear;
}

@keyframes animation {
	0% {
		opacity: 1;
	}

	50% {
		opacity: 0.4;
	}

	100% {
		opacity: 1;
	}
}
</style>
