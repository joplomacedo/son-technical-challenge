<template>
	<NuxtLink
		:class="$style.root"
		v-bind="props"
		:data-variant-underline="underline"
	>
		<slot />
	</NuxtLink>
</template>

<script setup lang="ts">
import type { NuxtLinkProps } from "#app";

const props = withDefaults(
	defineProps<
		NuxtLinkProps & {
			underline?: boolean;
		}
	>(),
	{
		underline: true,
	}
);
</script>

<style module>
.root {
	color: theme("colors.primary.500");
	cursor: pointer;
}

.root[data-variant-underline="true"] {
	text-decoration: underline;
}
</style>
