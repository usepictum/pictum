<script lang="ts">
import type { AvatarOptions } from "pictum";
import type { AvatarProps } from "../types.js";
import { useAvatar } from "./helpers.svelte.js";

let {
	seed,
	variant,
	gender,
	format,
	size,
	options,
	alt,
	...imageProps
}: AvatarProps = $props();
const helperOptions = $derived.by(
	() =>
		({
			...(options ?? {}),
			...(variant === undefined ? {} : { variant }),
			...(gender === undefined ? {} : { gender }),
			...(format === undefined ? {} : { format }),
			...(size === undefined ? {} : { size }),
		}) as AvatarOptions,
);
const asset = useAvatar(
	() => seed,
	() => helperOptions,
);
</script>

<img {...imageProps} src={asset.current.url} {alt} />
