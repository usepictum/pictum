<script lang="ts">
import { providePictumOptions } from "./provider.svelte.js";
import type { PictumProviderProps } from "./types.js";

let { options, children }: PictumProviderProps = $props();
providePictumOptions(() => options);
</script>

{@render children?.()}
