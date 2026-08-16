<script lang=ts>
    import type { ChessgroundController } from "../utils/controllers/ChessgroundController.svelte";
    
    let {chessgroundController}: {chessgroundController: ChessgroundController | undefined} = $props();
</script>

<ul>
    <!-- eslint-disable svelte/require-each-key -->
    {#each chessgroundController?.currentInteractivePgn as pgnNode}
        <button onclick={pgnNode.goto}>{pgnNode.label}</button>
    {/each}
</ul>