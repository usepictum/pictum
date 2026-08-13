import type { PictumOptions } from "pictum";

declare const __PICTUM_ASTRO_OPTIONS__: PictumOptions | undefined;

const configuredOptions =
	typeof __PICTUM_ASTRO_OPTIONS__ === "undefined"
		? {}
		: __PICTUM_ASTRO_OPTIONS__;

export function resolvePictumOptions(overrides?: PictumOptions): PictumOptions {
	const baseUrl = overrides?.baseUrl ?? configuredOptions.baseUrl;
	return baseUrl === undefined ? {} : { baseUrl };
}
