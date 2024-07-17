<template>
	<div :class="$style.root">
		<div
			v-if="label"
			:class="$style.label"
		>
			{{ label }}
		</div>
		<div><slot /></div>
		<Transition name="slide-down">
			<div
				v-if="error"
				:class="$style.error"
			>
				{{ error }}
			</div>
		</Transition>
	</div>
</template>

<script setup lang="ts">
defineProps<{
	label?: string;
	error?: string;
}>();
</script>

<style module>
.root {
}
.error {
	color: theme("colors.error.500");
	font-size: theme("fontSize.sm");
	margin-top: theme("spacing.1");
}
</style>
