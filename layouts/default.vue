<template>
	<div>
		<header :class="$style.header">
			<NuxtLink to="/">
				<NuxtImg
					src="img/logo/primary.svg"
					alt="Logo"
					width="100"
					height="20"
				/>
			</NuxtLink>
			<nav>
				<ul>
					<li>
						<NuxtLink to="/cart">My Shopping Cart</NuxtLink>
					</li>
				</ul>
			</nav>
		</header>
		<main :class="$style.main">
			<div :class="$style.main__content">
				<slot />
			</div>
		</main>
	</div>
</template>

<style module>
.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 1rem;
	background-color: theme("colors.gray.900");
	color: #fff;
}

.main {
	padding: theme("spacing.12") theme("spacing.8") theme("spacing.8");
}

.main__content {
	margin-inline: auto;
	max-width: theme("maxWidth.screen-xl");
}
</style>
