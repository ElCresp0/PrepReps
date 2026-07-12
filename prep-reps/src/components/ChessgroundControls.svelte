<script lang="ts">
let {nextPuzzleFoo}: {nextPuzzleFoo: CallableFunction} = $props();
</script>

<div id="chessgroundNavigationControls">
    <button onclick={() => nextPuzzleFoo()} class="chessgroundNavigationButton">Next Puzzle</button>
</div>

<style>
    button.chessgroundNavigationButton {
        background-color: #ddd;
        display: inline-block;
        width: 100px;
        height: 100px;
    }

    button.chessgroundNavigationButton:hover {
        background-color: #0b0;
        color: black;
    }
</style>