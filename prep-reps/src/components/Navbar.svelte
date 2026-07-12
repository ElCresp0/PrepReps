<script lang="ts">
    let { pages }: {pages: {address: string, title: string}[]} = $props();
</script>

<div class="navbar">
    <nav>
        <ul>
            <li><a href="/">Home</a></li>
            {#each pages as page}
                <li><a href="{page.address}">{page.title}</a></li>
            {/each}
        </ul>
    </nav>
</div>

<style>

.navbar {
	position: sticky;
	top: 0;
	width: 100%;
	z-index: 1000;
}

nav {
    background-color: #333;
    padding: 10px 20px;
}

nav ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
}

nav ul li {
    margin: 0 15px;
}

nav ul li a {
    color: white;
    text-decoration: none;
    padding: 10px 15px;
    display: block;
}

nav ul li a:hover {
    background-color: #575757;
    border-radius: 4px;
}   
</style>