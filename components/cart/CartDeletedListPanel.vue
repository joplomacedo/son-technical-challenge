<template>
	<div>
		<div class="mb-4">
			<span
				class="underline cursor-pointer text-sm"
				@click="() => (isDeletedItemsOpen = !isDeletedItemsOpen)"
			>
				{{ isDeletedItemsOpen ? "Hide deleted items" : "See deleted items" }}

				<span> ({{ deletedItems.length }}) </span>
			</span>
		</div>

		<div v-if="isDeletedItemsOpen">
			<CartDeletedList :items="deletedItems" />
		</div>
	</div>
</template>

<script setup lang="ts">
const { deletedItems } = useCartContext();

const isDeletedItemsOpen = ref(false);

watch(deletedItems, (deletedItems) => {
	if (!deletedItems.length) {
		isDeletedItemsOpen.value = false;
	}
});
</script>
