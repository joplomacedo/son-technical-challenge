<template>
	<ul class="space-y-2">
		<CartDeletedListItem
			v-for="item in items"
			:key="item.productId"
			:item="item"
		/>
	</ul>
</template>

<script setup lang="ts">
import type { Cart } from "@/queries/cart";

defineProps<{
	items: Cart["items"];
}>();
</script>
