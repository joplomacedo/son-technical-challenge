import type { NuxtApp } from "#app";

type Context<T extends () => any> = {
	subscribe: () => void;
	unsubscribe: () => void;
	context: ReturnType<T>;
};

function createContext<T extends () => any>(
	contextFactory: T,
	onScopeStop: () => void
): Context<T> {
	let subscribers = 0;

	const scope = effectScope(true);
	const context = scope.run(() => contextFactory()) as ReturnType<T>;

	function subscribe() {
		subscribers++;
	}

	function unsubscribe() {
		subscribers--;
		if (subscribers === 0) {
			scope.stop();
			onScopeStop();
		}
	}
	return {
		context,
		subscribe,
		unsubscribe,
	};
}

export default function <T extends () => any>(
	contextFactory: T
): () => ReturnType<T> {
	const contexts = new WeakMap<NuxtApp, Context<T>>();

	return () => {
		const nuxtApp = useNuxtApp();

		if (!contexts.has(nuxtApp)) {
			const context = createContext<T>(contextFactory, () => {
				contexts.delete(nuxtApp);
			});

			contexts.set(nuxtApp, context);
		}

		const { subscribe, unsubscribe, context } = contexts.get(nuxtApp)!;

		subscribe();
		onScopeDispose(unsubscribe);

		return context;
	};
}
