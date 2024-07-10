export default function useUser() {
	const user = useState<{
		id: string;
		currency: string;
		locale: string;
		email: string | null | undefined;
	}>("user", () => ({
		id: "1",
		currency: "USD",
		locale: "en-US",
		email: null,
	}));

	return user;
}
