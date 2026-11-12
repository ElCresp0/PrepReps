<script lang=ts>
    import type { IChildNode } from "../../utils/interfaces/IChildNode";
    import ChessopsPgnViewChild from "./_ChessopsPgnViewChild.svelte";
    
    let {currNode, indent=1}: {currNode: IChildNode, indent: number} = $props();
</script>

{#if currNode.label === undefined || currNode.goto === undefined}
<div id="PgnViewRoot">
    <ChessopsPgnViewChild currNode={currNode} indent={indent} />
</div>
{/if}

<style>
    #PgnViewRoot {
        text-align: left;
    }
</style>