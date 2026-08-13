import type { AstroIntegration } from "astro";
import type { PictumOptions } from "pictum";

export default function pictum(options: PictumOptions = {}): AstroIntegration {
	return {
		name: "@pictum/astro",
		hooks: {
			"astro:config:setup": ({ updateConfig }) => {
				updateConfig({
					vite: {
						define: {
							__PICTUM_ASTRO_OPTIONS__: JSON.stringify(options),
						},
					},
				});
			},
		},
	};
}
