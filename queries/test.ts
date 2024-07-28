function useTodos() {
	const user = useState<User>("user-test", () => ({
		id: "1",
		currency: "USD",
		locale: "en-US",
		email: null,
	}));
	const userKeyUnit = computed(() => ({
		id: user.value.id,
		currency: user.value.currency,
	}));

	const query = useQuery({
		queryFn: async () => {
			const response = await fetch(
				"https://jsonplaceholder.typicode.com/todos/"
			);
			return response.json();
		},
		queryKey: [userKeyUnit, "todos"],
	});

	return query;
}

export { useTodos };
