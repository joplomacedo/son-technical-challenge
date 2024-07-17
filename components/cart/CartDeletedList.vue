<template>
	<ul class="space-y-2">
		<CartDeletedListItem
			v-for="item in items"
			:item="item"
			:key="item.productId"
		/>
	</ul>
</template>

<script setup lang="ts">
import type { Cart } from "@/queries/cart";

defineProps<{
	items: Cart["items"];
}>();
</script>
