type FormatPriceGlobal = (price: number | null | undefined) => string;

declare module "vue" {
	interface ComponentCustomProperties {
		$formatPrice: FormatPriceGlobal;
	}
}

export default defineNuxtPlugin((nuxtApp) => {
	nuxtApp.vueApp.use({
		install(app) {
			app.config.globalProperties.$formatPrice = (
				...args: Parameters<FormatPriceGlobal>
			): ReturnType<FormatPriceGlobal> => {
				const [price] = args;
				const { user } = useUserStore();

				if (isNil(price)) {
					return "";
				}

				return formatPrice(price, {
					locale: user.value.locale,
					currency: user.value.currency,
				});
			};
		},
	});
});
