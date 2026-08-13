<script lang="ts">
    import Icon from "@iconify/svelte";
    import type { IButtonLabel } from "../utils/interfaces/IButtonLabel";

let {buttonDefs}: {buttonDefs: IButtonLabel[]} = $props();

let displayNone = $state([] as {displayNone: boolean}[]);
let topLevelButtons = [] as HTMLElement[];


// svelte-ignore state_referenced_locally
displayNone = buttonDefs.map((btn: IButtonLabel) => {
    return btn.dropdown === undefined ?
        {displayNone: false} :
        {displayNone: true}
});

function clickedElement(element: HTMLElement, event: MouseEvent) {
    return event.target instanceof Node && element.contains(event.target);
}

function documentOnClick(event: MouseEvent) {
    displayNone.forEach((_, index: number) => {
        // hide if clicked outside of a top level button,
        if (clickedElement(topLevelButtons[index], event) === false) {
            displayNone[index].displayNone = true;
        }
    });
}
</script>

<svelte:document on:click={documentOnClick} />

<div id="chessgroundNavigationControls">
    <!-- eslint-disable svelte/require-each-key -->
    {#each buttonDefs as btn, index}
        {#if btn.onclick !== undefined}
            <button bind:this={topLevelButtons[index]} onclick={() => btn.onclick!()}
                    class="chessgroundCtrlButton">
                {#if btn.label.startsWith("mdi-")}
                    <Icon icon="mdi-light:{btn.label.substring(4)}" style="font-size: 1.5em;"/>
                {:else}
                    {btn.label}
                {/if}
            </button>
        {:else if btn.dropdown !== undefined}
            <ul class="dropdownButtons">
                <li>
                   <button bind:this={topLevelButtons[index]} onclick={() => {displayNone[index].displayNone = !displayNone[index].displayNone}}
                            class="chessgroundCtrlButton">
                        {#if btn.label.startsWith("mdi-")}
                            <Icon icon="mdi-light:{btn.label.substring(4)}" style="font-size: 1.5em;"/>
                        {:else}
                            {btn.label}
                        {/if}
                    </button>
                </li>
                {#each btn.dropdown! as dropdownBtn}
                    <li style="display: {(displayNone[index].displayNone) ? 'none' : 'normal' }">
                        <button onclick={() => dropdownBtn.onclick!()}
                                class="chessgroundCtrlButton dropdown">
                            {#if dropdownBtn.label.startsWith("mdi-")}
                                <Icon icon="mdi-light:{dropdownBtn.label.substring(4)}" style="font-size: 1.5em;"/>
                            {:else}
                                {dropdownBtn.label}
                            {/if}
                        </button>
                    </li>
                {/each}
            </ul>
        {/if}

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

    ul.dropdownButtons {
        display: inline-block;
        vertical-align: top;
        list-style: none;
        margin: 0;
        padding: 0;
    }

    button.dropdown {
        background-color: #ccc;
        height: 40px;
    }

</style>