<template>
	<div :class="[$style.root, attrsClass]">
		<input
			v-model="model"
			:class="$style.input"
			v-bind="attrsRest"
			type="text"
		/>
		<BaseIcon
			v-if="icon"
			:class="$style.icon"
			:name="icon"
		/>
	</div>
</template>

<script setup lang="ts">
import type { Props } from "./Icon/index.vue";

defineProps<{
	icon?: Props["name"];
}>();

defineOptions({
	inheritAttrs: false,
});

const { class: attrsClass, ...attrsRest } = useAttrs();
const model = defineModel();
</script>

<style module>
.root {
	display: flex;
	align-items: center;
	border: 1px solid theme("colors.gray.300");
	border-radius: theme("borderRadius.md");
	padding: 0.5rem 1rem;
	overflow: hidden;

	&:focus-within {
		border-color: theme("colors.primary.500");
	}
}

.input {
	display: block;
	width: 100%;
	background-color: transparent;
}

.icon {
	margin-left: auto;
}
</style>
