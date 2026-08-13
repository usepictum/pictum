<script lang="ts">
import { useAvatar } from "../../src/index.js";

let seed = $state("ada-lovelace");
const asset = useAvatar(() => seed, { format: "webp" });
</script>

<button type="button" onclick={() => (seed = "grace-hopper")}>Change</button>
<span data-testid="asset-url">{asset.current.url}</span>
