<template>
	<component
		:class="$style.root"
		:is="component"
	/>
</template>

<script setup lang="ts">
// https://nuxt.com/docs/guide/directory-structure/components#dynamic-components
// If you are using resolveComponent to handle dynamic components, make sure not
// to insert anything but the name of the component, which must be a string and not a variable.

//TODO figure this out
const componentResolvers = {
	ArrowLongRight: () => resolveComponent("BaseIconIconsArrowLongRight"),
	ExclamationTriangle: () =>
		resolveComponent("BaseIconIconsExclamationTriangle"),
	Plus: () => resolveComponent("BaseIconIconsPlus"),
	Trash: () => resolveComponent("BaseIconIconsTrash"),
	Minus: () => resolveComponent("BaseIconIconsMinus"),
} as const;

const props = defineProps<{
	name: keyof typeof componentResolvers;
}>();

const component = computed(() => componentResolvers[props.name]());
</script>

<style module>
.root {
	display: inline-block;
	width: 1lh;
	aspect-ratio: 1;
}
</style>
