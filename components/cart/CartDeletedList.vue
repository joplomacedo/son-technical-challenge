<template>
	<ul :class="$style.root">
		<CartDeletedListItem
			v-for="item in items"
			:item="item"
			:key="item.productId"
			:class="$style.item"
		/>
	</ul>
</template>

<script setup lang="ts">
import type { Cart } from "@/queries/cart";

defineProps<{
	items: Cart["items"];
}>();
</script>

<style module>
.root > * + * {
	margin-top: theme("spacing.4");
}
</style>
