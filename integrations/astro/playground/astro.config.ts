import pictum from "@pictum/astro";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
	integrations: [pictum()],
	vite: {
		plugins: [tailwindcss()],
	},
});
