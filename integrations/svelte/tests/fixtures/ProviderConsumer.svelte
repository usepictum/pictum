<script lang="ts">
import { Avatar, QrCode, useAvatar } from "../../src/index.js";

let { overrideBaseUrl }: { overrideBaseUrl: string } = $props();
const inherited = useAvatar("grace-hopper");
</script>

<Avatar seed="ada-lovelace" alt="Ada" />
<QrCode
	value="hello"
	alt="Hello"
	options={{ baseUrl: overrideBaseUrl }}
/>
<span data-testid="inherited">{inherited.current.url}</span>
