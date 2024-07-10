// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: true },

	modules: [
		"@nuxtjs/tailwindcss",
		"@nuxt/eslint",
		"@hebilicious/vue-query-nuxt",
		"@nuxt/image",
		"floating-vue/nuxt",
		["@nuxtjs/google-fonts", { families: { Inter: "100..900" } }],
	],

	compatibilityDate: "2024-07-16",
});
