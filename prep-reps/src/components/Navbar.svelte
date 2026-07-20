<script lang="ts">
    import LoginNav from "./LoginNav.svelte";
    import "$lib/assets/navbar.css";
    import { resolve } from "$app/paths";

    let { pages }: {pages: {address: string, title: string}[]} = $props();

</script>

<div class="navbar">
    <nav>
        <ul>
            <li class="logo"><a href={resolve("/")}> PrepReps</a></li>
            <li><a href={resolve("/")}>Home</a></li>
            <!-- eslint-disable svelte/require-each-key -->
            {#each pages as page}
                <!-- eslint-disable svelte/no-navigation-without-resolve -->
                <li><a href={page.address}>{page.title}</a></li>
            {/each}
            <LoginNav />
        </ul>
    </nav>
</div>

<style>
    .logo {
        font-family: Verdana, Geneva, Tahoma, sans-serif;
        font-size: x-large;
    }
</style>