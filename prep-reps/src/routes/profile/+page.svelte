<script lang="ts">
    import { goto } from "$app/navigation";
    import type { PageProps } from './$types';
    import { userState } from "../../state.svelte";
    import { resolve } from "$app/paths";


    let { data }: PageProps = $props();
    let username: string = $state("");
    let userPuzzles: {title: string, pgn: string}[] = $state([]);

    async function signOut() {
        console.debug("sign out");
        userState.name = null;
        userState.token = null;
        // goto("/auth");
        // goto("/auth?/signOut");
        goto(resolve("/auth?signOut=1"));
        // redirect(200, "/auth?/signOut");
    }

    $effect(() => {
        console.debug("profile visited");
        console.debug("data", data);
        
        if (data.username === null || data.token === null) {
            goto(resolve("/auth?signOut=1"));
            // redirect(200, "/auth?signOut=1");
        }
        username = data.username!;
        userPuzzles = data.puzzles || [];

        // localStorage.setItem("username", username);
        // localStorage.setItem("token", data.token!);
        userState.name = username;
        userState.token = data.token;
    });

</script>

<h1>Hello, {username}!</h1>
<p>You have {userPuzzles.length} puzzles, head over to <a href={resolve("/train")}>Train Page</a> to take some pratice.</p>
<button onclick={signOut}>Sign out</button>
