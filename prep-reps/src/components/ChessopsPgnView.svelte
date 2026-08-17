<script lang=ts>
    import type { IChildNode } from "../utils/interfaces/IChildNode";
    import Self from "./ChessopsPgnView.svelte";
    
    let {currNode, indent=1}: {currNode: IChildNode, indent: number} = $props();
</script>

    {#if currNode.children && currNode.children.length === 1}
        <!-- straight line -->
        {#if currNode.label && currNode.goto}
            <button onclick={currNode.goto}>{currNode.label}</button>
         {/if}
        <Self currNode={currNode.children[0]} indent={indent}/>

    {:else if currNode.children && currNode.children.length > 0}
        <!-- sidelines -->
        {#if currNode.label && currNode.goto}
            <button onclick={currNode.goto}>{currNode.label}</button>
         {/if}
        {#each currNode.children as moveNode, index}
            <br>{#each new Array(indent) as _}&emsp;{/each}
            {index}
            <Self currNode={moveNode} indent={indent + 1}/>
        {/each}
    {:else}
        <!-- end of line -->
        {#if currNode.label}
            <button onclick={currNode.goto}>{currNode.label}</button>
         {/if}
    {/if}