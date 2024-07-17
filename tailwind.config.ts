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
			fontSize: {
				xs: "clamp(0.6076rem, 0.5964rem + 0.0563vw, 0.64rem)",
				sm: "clamp(0.7292rem, 0.7045rem + 0.1232vw, 0.8rem)",
				base: "clamp(0.875rem, 0.8315rem + 0.2174vw, 1rem)",
				lh: "clamp(1.05rem, 0.9804rem + 0.3478vw, 1.25rem)",
				xl: "clamp(1.26rem, 1.1548rem + 0.5261vw, 1.5625rem)",
				"2xl": "clamp(1.512rem, 1.3586rem + 0.7672vw, 1.9531rem)",
				"3xl": "clamp(1.8144rem, 1.5963rem + 1.0904vw, 2.4414rem)",
				"4xl": "clamp(2.1773rem, 1.8731rem + 1.5208vw, 3.0518rem)",
				"5xl": "clamp(2.6127rem, 2.1947rem + 2.0904vw, 3.8147rem)",
				"6xl": "clamp(3.1353rem, 2.5673rem + 2.8402vw, 4.7684rem)",
				"7xl": "clamp(3.7623rem, 2.9978rem + 3.8228vw, 5.9605rem)",
				"8xl": "clamp(4.5148rem, 3.4937rem + 5.1057vw, 7.4506rem)",
				"9xl": "clamp(5.4178rem, 4.0628rem + 6.7747vw, 9.3132rem)",
			},
		},
	},
};
