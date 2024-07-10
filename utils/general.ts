function pipe<T>(...fns: ((arg: T) => T)[]): (arg: T) => T {
	return (arg) => fns.reduce((acc, fn) => fn(acc), arg);
}

function isNil<T>(value: T | null | undefined): value is null | undefined {
	return value === null || value === undefined;
}

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function debounce<T extends (...args: any[]) => any>(
	fn: T,
	ms: number
): {
	(...args: Parameters<T>): void;
	cancel: () => void;
	flush: () => void;
} {
	let timeout: ReturnType<typeof setTimeout> | undefined;
	let awaitArgs: Parameters<T>;

	function flush() {
		if (!timeout) return;
		clearTimeout(timeout);
		timeout = undefined;
		fn(...awaitArgs);
	}

	function cancel() {
		if (!timeout) return;
		clearTimeout(timeout);
		timeout = undefined;
	}

	function debounced(...args: Parameters<T>) {
		clearTimeout(timeout);
		awaitArgs = args;
		timeout = setTimeout(flush, ms);
	}

	debounced.cancel = cancel;
	debounced.flush = flush;

	return debounced;
}

export { pipe, isNil, randomInt, sleep, debounce };
