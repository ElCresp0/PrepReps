<script lang="ts">
    import LoginNav from "./LoginNav.svelte";
    import "$lib/assets/navbar.css";

    let { pages }: {pages: {address: string, title: string}[]} = $props();

</script>

<div class="navbar">
    <nav>
        <ul>
            <li class="logo"><a href="/"> PrepReps</a></li>
            <li><a href="/">Home</a></li>
            {#each pages as page}
                <li><a href="{page.address}">{page.title}</a></li>
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