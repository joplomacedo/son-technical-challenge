type TimerState = {
	status: "running" | "paused" | "idle" | "complete";
	complete: boolean;
	progress: number;
	elapsed: number;
	remaining: number;
};

type SubscriptionCallback = (state: TimerState) => void;

type TimerConfig = {
	duration: number;
	onComplete?: SubscriptionCallback;
	granularity?: number;
};

class Timer {
	private duration: number;
	private subscriptions: Set<SubscriptionCallback> = new Set();
	private tickTimeout: ReturnType<typeof setTimeout> = setTimeout(() => {}, 0); // just for typing
	state: TimerState;
	private onComplete?: SubscriptionCallback;
	private granularity: number;

	constructor({ duration, onComplete, granularity }: TimerConfig) {
		this.duration = duration;
		this.state = this.getInitialState();
		this.onComplete = onComplete;
		this.granularity = granularity ?? 60;
	}

	private getInitialState = () => {
		const initalState: TimerState = {
			status: "idle",
			complete: false,
			progress: 0,
			elapsed: 0,
			remaining: this.duration,
		};

		return initalState;
	};

	private tick = (end: number) => {
		const now = new Date().getTime();

		const remaining = Math.max(0, end - now);
		const elapsed = this.duration - remaining;
		const progress = elapsed / this.duration;
		const complete = progress === 1;
		const status = complete ? "complete" : "running";

		this.updateState({
			status,
			remaining,
			elapsed,
			progress,
			complete,
		});

		if (complete) {
			this.onComplete?.(this.state);
			return;
		}

		this.tickTimeout = setTimeout(() => this.tick(end), this.granularity);
	};

	private updateState = (state: TimerState) => {
		this.state = state;
		this.subscriptions.forEach((cb) => cb(state));
	};

	start = () => {
		if (this.state.status === "running") return;
		const end = new Date().getTime() + this.duration;
		this.tick(end);
	};

	stop = () => {
		clearTimeout(this.tickTimeout);
		this.updateState(this.getInitialState());
	};

	// alias for clarity. when we just want to reset the state after the timer has completed
	// though it also stops the timer
	reset = () => {
		this.stop();
	};

	pause = () => {
		clearTimeout(this.tickTimeout);
		this.updateState({ ...this.state, status: "paused" });
	};

	resume = () => {
		const end = new Date().getTime() + this.state.remaining;
		this.tick(end);
	};

	restart = () => {
		this.stop();
		this.start();
	};

	subscribe = (cb: SubscriptionCallback) => {
		this.subscriptions.add(cb);
		return () => this.subscriptions.delete(cb);
	};
}

function createTimer(timerConfig: TimerConfig) {
	return new Timer(timerConfig);
}

export default createTimer;
