// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: true },

	imports: {
		dirs: ["composables/**/use*.{ts,js}", "store/**/index.{ts,js}"],
	},

	modules: [
		"@nuxtjs/tailwindcss",
		"@nuxt/eslint",
		"@hebilicious/vue-query-nuxt",
		"@nuxt/image",
		"floating-vue/nuxt",
		"@vueuse/nuxt",
		//TODO: review fonts in use
		["@nuxtjs/google-fonts", { families: { Inter: "100..900" } }],
	],

	compatibilityDate: "2024-07-16",
	ssr: false,
});
