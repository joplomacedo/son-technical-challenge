<template>
	<NuxtLink
		:class="$style.root"
		v-bind="props"
	>
		<slot />
	</NuxtLink>
</template>

<script setup lang="ts">
import type { NuxtLinkProps } from "#app";

const props = defineProps<NuxtLinkProps>();
</script>

<style module>
.root {
	color: theme("colors.primary.500");
	text-decoration: underline;
	cursor: pointer;
}
</style>
