<script lang="ts">
import type { QrCodeOptions } from "pictum";
import type { QrCodeProps } from "../types.js";
import { useQrCode } from "./helpers.svelte.js";

let {
	value,
	format,
	quietZone,
	foreground,
	background,
	options,
	alt,
	...imageProps
}: QrCodeProps = $props();
const helperOptions = $derived.by(
	() =>
		({
			...(options ?? {}),
			...(format === undefined ? {} : { format }),
			...(quietZone === undefined ? {} : { quietZone }),
			...(foreground === undefined ? {} : { foreground }),
			...(background === undefined ? {} : { background }),
		}) satisfies QrCodeOptions,
);
const asset = useQrCode(
	() => value,
	() => helperOptions,
);
</script>

<img {...imageProps} src={asset.current.url} {alt} />
