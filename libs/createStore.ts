export default function <T extends () => any>(storeFn: T): () => ReturnType<T> {
	let result: ReturnType<T>;

	return function () {
		if (!result) {
			result = storeFn();
		}

		return result;
	};
}
