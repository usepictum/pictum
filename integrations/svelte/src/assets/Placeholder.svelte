<script lang="ts">
import type { PlaceholderOptions } from "pictum";
import type { PlaceholderProps } from "../types.js";
import { usePlaceholder } from "./helpers.svelte.js";

let {
	size,
	width,
	height,
	format,
	density,
	background,
	color,
	text,
	options,
	alt,
	...imageProps
}: PlaceholderProps = $props();
const helperOptions = $derived.by(() => {
	const dimensions =
		size === undefined
			? { width: width as number, height: height as number }
			: { size };
	return {
		...(options ?? {}),
		...dimensions,
		...(format === undefined ? {} : { format }),
		...(density === undefined ? {} : { density }),
		...(background === undefined ? {} : { background }),
		...(color === undefined ? {} : { color }),
		...(text === undefined ? {} : { text }),
	} as PlaceholderOptions;
});
const asset = usePlaceholder(() => helperOptions);
</script>

<img
	{...imageProps}
	src={asset.current.url}
	{alt}
	width={size ?? width}
	height={size ?? height}
/>
