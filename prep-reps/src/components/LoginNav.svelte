<script lang="ts">
    import Icon from "@iconify/svelte";
    import { userState } from "../state.svelte";
    import { resolve } from "$app/paths";

    let route = $derived(
        (userState.name !== null && userState.token !== null) ?
            resolve("/profile") :
            resolve("/auth")
    );
</script>

<li><a href={route}><Icon icon="mdi-light:account" style="font-size: 1.5em;"/></a></li>

