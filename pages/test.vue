<template>
	<div>Test</div>
	<div v-if="isLoading">Loading...</div>
	<div v-if="isError">Error: {{ error }}</div>
	<div v-if="todos">
		<div>{{ todos.title }}</div>
		<div>{{ todos.completed }}</div>
		<ul>
			<li v-for="todo in todos">{{ todo.title }}</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
import { useTodos } from "~/queries/test";

const { data: todos, isLoading, isError, error, suspense } = useTodos();

onServerPrefetch(async () => {
	await suspense();
});
</script>
