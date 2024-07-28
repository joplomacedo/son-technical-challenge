import createStore from "~/libs/createStore";

type User = {
	id: string;
	currency: string;
	locale: string;
	email: string | null | undefined;
};

export const useUserStore = createStore(function () {
	const user = useState<User>("user", () => ({
		id: "1",
		currency: "USD",
		locale: "en-US",
		email: null,
	}));

	return { user };
});

export type { User };
