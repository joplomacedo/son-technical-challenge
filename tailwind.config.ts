import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";
import colors from "tailwindcss/colors";

const fontFamilySans = ["Inter", ...defaultTheme.fontFamily.sans];

export default <Partial<Config>>{
	theme: {
		extend: {
			fontFamily: {
				sans: fontFamilySans,
				display: fontFamilySans,
				body: fontFamilySans,
			},
			colors: {
				primary: colors.indigo,
				error: colors.red,
			},
		},
	},
};
