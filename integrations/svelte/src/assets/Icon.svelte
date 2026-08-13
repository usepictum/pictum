<script module lang="ts">
import type { PictumAsset } from "pictum";

interface ParsedIcon {
	body: string;
	viewBox: string;
}

const iconCache = new Map<string, Promise<ParsedIcon>>();
const pendingIcon = new Promise<ParsedIcon>(() => {});

function loadIcon(asset: PictumAsset): Promise<ParsedIcon> {
	const cached = iconCache.get(asset.url);
	if (cached !== undefined) {
		return cached;
	}

	const request = asset.svg().then(parseIcon);
	iconCache.set(asset.url, request);
	void request.catch(() => {
		if (iconCache.get(asset.url) === request) {
			iconCache.delete(asset.url);
		}
	});

	return request;
}

function parseIcon(svg: string): ParsedIcon {
	const root = /^\s*<svg\b([^>]*)>([\s\S]*)<\/svg>\s*$/i.exec(svg);
	const attributes = root?.[1];
	const body = root?.[2];
	const viewBox =
		attributes === undefined
			? undefined
			: /\bviewBox\s*=\s*(["'])(.*?)\1/i.exec(attributes)?.[2];

	if (body === undefined || viewBox === undefined) {
		throw new Error("Pictum returned invalid icon SVG markup.");
	}

	return { body, viewBox };
}
</script>

<script lang="ts">
	import type { IconProps } from "../types.js";
	import { useIcon } from "./helpers.svelte.js";

	let { name, options, ...svgProps }: IconProps = $props();
	const asset = useIcon(() => name, () => options);
	let markup = $state<Promise<ParsedIcon>>(pendingIcon);

	$effect(() => {
		markup = loadIcon(asset.current);
	});
</script>

{#await markup}
	<svg xmlns="http://www.w3.org/2000/svg" {...svgProps}></svg>
{:then resolved}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox={resolved.viewBox}
		{...svgProps}
	>
		{@html resolved.body}
	</svg>
{/await}
