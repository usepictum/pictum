<script lang="ts">
import { PictumProvider } from "../../src/index.js";
import ProviderConsumer from "./ProviderConsumer.svelte";

let {
	providerBaseUrl,
	overrideBaseUrl,
}: { providerBaseUrl: string; overrideBaseUrl: string } = $props();
</script>

<PictumProvider options={{ baseUrl: providerBaseUrl }}>
	<ProviderConsumer {overrideBaseUrl} />
</PictumProvider>
