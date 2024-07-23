<template>
	<component
		:is="component"
		:class="[
			$style.root,
			{
				[$style['is-loading']]: loading,
			},
		]"
		:data-variant-size="size"
		:data-variant-shape="shape"
		:data-variant-color="color"
	>
		<div :class="$style.content">
			<slot />
		</div>

		<Transition name="scale-up">
			<div
				v-if="loading"
				:class="$style.spinnerWrapper"
			>
				<BaseSpinner
					:class="$style.spinner"
					size="sm"
					color="white"
				/>
			</div>
		</Transition>
	</component>
</template>

<script setup lang="ts">
withDefaults(
	defineProps<{
		component?: string | Component;
		size?: "xs" | "sm" | "md" | "lg";
		shape?: "rectangle" | "circle";
		color?: "primary" | "secondary";
		loading?: boolean;
	}>(),
	{
		component: "button",
		size: "md",
		shape: "rectangle",
		color: "primary",
		loading: false,
	}
);
</script>

<style module>
/* TODO: loading and disabled states conflict. fix */
/* TODO: different shapes should have same heights if same size */
/* Default State */
.root {
	position: relative;
	border: 1px solid transparent;
	cursor: pointer;
	transition: 0.3s;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	font-weight: theme("fontWeight.semibold");
	flex-shrink: 0;

	&[disabled] {
		cursor: not-allowed;
	}
}

.content {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	transition: theme("transitionDelay.200");
}

.spinnerWrapper {
	position: absolute;
	inset: 0;
	display: flex;
	align-items: center;
	justify-content: center;
}

.root.is-loading {
	.content {
		opacity: 0;
	}
}

/* Default State > Variants */
.root[data-variant-color="primary"] {
	background-color: theme("colors.primary.500");
	color: #fff;

	&:hover {
		background-color: theme("colors.primary.600");
	}

	&:active {
		background-color: theme("colors.primary.700");
	}

	&[disabled] {
		background-color: theme("colors.primary.100");
		color: theme("colors.primary.300");
	}
}

.root[data-variant-color="secondary"] {
	background-color: theme("colors.gray.200");
	color: theme("colors.primary.500");

	&:hover {
		background-color: theme("colors.gray.300");
		color: theme("colors.primary.600");
	}

	&:active {
		background-color: theme("colors.gray.400");
		color: theme("colors.primary.700");
	}

	&[disabled] {
		background-color: theme("colors.primary.50");
		color: theme("colors.primary.200");
	}
}

.root[data-variant-size="xs"] {
	font-size: theme("fontSize.xs");
}

.root[data-variant-size="sm"] {
	font-size: theme("fontSize.sm");
}

.root[data-variant-size="md"] {
	font-size: theme("fontSize.base");
}

.root[data-variant-size="lg"] {
	font-size: theme("fontSize.lg");
}

.root[data-variant-shape="rectangle"] {
	border-radius: theme("borderRadius.md");
}

.root[data-variant-shape="circle"] {
	width: var(--size);
	height: var(--size);
	border-radius: 50%;

	align-items: center;
	justify-content: center;
}

/* Default State > Variants > Compound */
.root[data-variant-shape="rectangle"][data-variant-size="xs"] {
	padding: theme("spacing.1") theme("spacing.2");
}

.root[data-variant-shape="rectangle"][data-variant-size="sm"] {
	padding: theme("spacing.1") theme("spacing.2");
}

.root[data-variant-shape="rectangle"][data-variant-size="md"] {
	padding: theme("spacing.2") theme("spacing.3");
}

.root[data-variant-shape="circle"][data-variant-size="xs"] {
	--size: theme("spacing.6");
}

.root[data-variant-shape="circle"][data-variant-size="sm"] {
	--size: theme("spacing.8");
}

.root[data-variant-shape="circle"][data-variant-size="md"] {
	--size: theme("spacing.10");
}

.root[data-variant-shape="circle"][data-variant-size="md"] {
	--size: theme("spacing.12");
}
</style>
