<script lang="ts">
import { Icon } from "../../src/index.js";

let { baseUrl }: { baseUrl: string } = $props();
</script>

<div>
	<Icon
		name="lucide:svelte-test-icon"
		aria-label="Test icon"
		class="icon"
		options={{ baseUrl }}
	/>
	<Icon
		name="lucide:svelte-test-icon"
		aria-label="Second test icon"
		options={{ baseUrl }}
	/>
</div>
