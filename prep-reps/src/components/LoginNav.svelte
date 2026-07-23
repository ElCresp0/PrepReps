<script lang="ts">
    import Icon from "@iconify/svelte";
    import { userState } from "../state.svelte";
    import { resolve } from "$app/paths";
</script>


{#if userState.name !== null && userState.token !== null}
    <li><a href={resolve("/profile")}><Icon icon="mdi-light:account" /></a></li>
{:else}
    <li><a href={resolve("/auth")}><Icon icon="mdi-light:account" /></a></li>
{/if}
