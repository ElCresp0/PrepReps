<script lang="ts">
let {buttonDefs}: {buttonDefs: {label: string, onclick: CallableFunction}[]} = $props();
</script>

<div id="chessgroundNavigationControls">
    <!-- eslint-disable svelte/require-each-key -->
    {#each buttonDefs as btn}
        <button onclick={() => btn.onclick()} class="chessgroundCtrlButton">{btn.label}</button>
    {/each}
</div>

<style>
    button.chessgroundCtrlButton {
        background-color: #ddd;
        display: inline-block;
        width: calc(var(--chessgroundSize)/var(--buttonsCount));
        height: 50px;
    }

    button.chessgroundCtrlButton:hover {
        background-color: #0b0;
        color: black;
    }
</style>