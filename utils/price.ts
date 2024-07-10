function formatPrice(
	price: number,
	{
		locale = "en-US",
		currency,
	}: {
		locale?: string;
		currency: string;
	}
) {
	return new Intl.NumberFormat(locale, {
		style: "currency",
		currency,
	}).format(price);
}

export { formatPrice };
