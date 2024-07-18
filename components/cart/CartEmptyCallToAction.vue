<template>
	<div :class="$style.root">
		Your cart is empty.
		<BaseLink to="/">Go shopping!</BaseLink>
	</div>
</template>

<style module>
.root {
	text-align: center;
	padding: theme("spacing.16") theme("spacing.4");
	border-radius: theme("borderRadius.md");
	background-color: theme("colors.gray.100");
}
</style>
