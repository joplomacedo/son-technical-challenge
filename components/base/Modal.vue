<template>
	<div
		:class="$style.overlay"
		:data-variant-width="props.width"
		@click="emit('close')"
	>
		<div
			:class="$style.modal"
			@click.stop
		>
			<slot />
		</div>
	</div>
</template>

<script setup lang="ts">
const props = withDefaults(
	defineProps<{
		width?: number | string;
	}>(),
	{
		width: "md",
	}
);

const emit = defineEmits<{
	close: [];
}>();

const widthCssVar = computed(() => {
	return (
		{
			sm: "350px",
			md: "475px",
			lg: "750px",
		}[props.width] ??
		(typeof props.width === "number" ? props.width + "px" : props.width)
	);
});
</script>

<style module>
.overlay {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	justify-content: center;
	align-items: safe center;
	overflow: auto;
	/* TODO create z index lib */
	z-index: 999;
	padding: theme("spacing.4");
}

.modal {
	background-color: #fff;
	padding: theme("spacing.8");
	border-radius: theme("borderRadius.md");
	box-shadow: theme("boxShadow.md");
	animation: enter 0.3s;
	width: v-bind(widthCssVar);
	border-top: 6px solid theme("colors.gray.800");
}

@keyframes enter {
	from {
		opacity: 0;
		transform: translateY(-10px);
	}
}
</style>
