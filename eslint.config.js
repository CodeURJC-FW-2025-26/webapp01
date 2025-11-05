import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import htmlPlugin from "eslint-plugin-html";

export default defineConfig([
	{
		files: ["**/*.{js,mjs,cjs}"],
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.es2021,
			},
		},
		plugins: {
			html: htmlPlugin,
		},
		...js.configs.recommended,
		rules: {
			indent: ["error", "tab"],
			quotes: ["error", "double"],
			semi: ["error", "always"],
			"no-unused-vars": ["warn"],
			"no-console": "off",
			"no-var": "error",
			eqeqeq: ["error", "always"],
		},
	},

	{
		files: ["**/*.html"],
		plugins: {
			html: htmlPlugin,
		},
		languageOptions: {
			globals: globals.browser,
		},
		rules: {
			indent: ["error", "tab"],
		},
	},

	{
		ignores: ["node_modules/", "dist/", "build/"],
	},
]);
