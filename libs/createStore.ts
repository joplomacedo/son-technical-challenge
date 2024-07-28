export default function <T extends () => any>(
	storeFactory: T
): () => ReturnType<T> {
	const stores = new WeakMap();

	return () => {
		const nuxtApp = useNuxtApp();

		if (!stores.has(nuxtApp)) {
			const scope = effectScope(true);
			const store = scope.run(() => storeFactory());
			stores.set(nuxtApp, store);
		}

		return stores.get(nuxtApp);
	};
}
