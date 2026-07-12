<script lang="ts">
	import Navbar from '../components/Navbar.svelte';

	let { children } = $props();
	let pages = [
		{
			address: "/train",
			title: "Train"
		},
		{
			address: "/construct",
			title: "Construct"
		}
	]
</script>

<svelte:head>
<!-- TODO: make a nice icon -->
</svelte:head>

<div class="navbar">
<Navbar pages={pages}/>
</div>

<div class="body">
{@render children()}
</div>
