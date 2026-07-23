<script lang="ts">
    import { enhance } from "$app/forms";
    import type { PageProps } from "./$types";

    let { data }: PageProps = $props();

</script>

<h1>Sign in or create an account.</h1>

<form method="POST" use:enhance>
    <div class="form-group">
        <label for="inputUsername">Username</label>
        <input name="username" type="username" id="inputUsername">
    </div>
    <div class="form-group">
        <label for="inputPassword">Password</label>
        <input name="password" type="password" id="inputPassword">
    </div>
    <button type="submit" formaction="?/signUp">Sign up</button>
    <button type="submit" formaction="?/signIn">Sign in</button>
</form>

<p class="error_message">{data.login_message}</p>

<style>
form {
    border-radius: 5px;
    background-color: #f2f2f2;
    padding: 20px;
}

label {display: block;}

.form-group {
    margin-bottom: 5px;
}

.error_message {
    font-style: italic;
    color: #f00;
}

</style>