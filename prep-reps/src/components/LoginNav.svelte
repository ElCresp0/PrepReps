<script lang="ts">
    import Icon from "@iconify/svelte";
    import { userState } from "../state.svelte";
</script>


{#if userState.name !== null && userState.token !== null}
    <li><a href="/profile"><Icon icon="mdi-light:account" /></a></li>
{:else}
    <li><a href="/auth"><Icon icon="mdi-light:account" /></a></li>
{/if}
