<script lang="ts">
  import { scale } from "svelte/transition";
  import Main from "./Main.svelte";
  import { step } from "./stores.js";
  import SideBarOption from "./SideBarOption.svelte";

  // Get the current step from the URL
  const url = new URL(location.href);
  const stepFromUrl = url.searchParams.get("step");
  step.set(stepFromUrl ? parseInt(stepFromUrl) : 0);

  // Update the URL when the step changes
  step.subscribe((value) => {
    url.searchParams.set("step", value.toString());
    history.pushState(null, "", url);
  });

  // On back button press, go back in history
  window.addEventListener("popstate", () => {
    step.set(parseInt(new URL(location.href).searchParams.get("step")));
  });

  let showInviteModal = false;
</script>

<div class="h-screen flex">
  <ol class="h-screen bg-gray-900 w-16 flex flex-col">
    <SideBarOption number={-1} />
    <SideBarOption number={0} />
    <SideBarOption number={1} />
    <SideBarOption number={2} />
  </ol>

  <main class="flex-1 min-h-screen bg-neutral-900">
    {#if $step === -1 || $step === 0 || $step === 1}
      <div class="bg-neutral-900 py-6 m-4 sm:py-12">
        <div class="relative py-3 sm:max-w-xl sm:mx-auto">
          {#if $step === -1}
            Work in progress, please check back later!
          {/if}
          {#if $step === 0}
            <h1 class="text-4xl font-bold text-white">Avatar Fusion</h1>
            <p class="mt-4 text-gray-200">
              You can use AvatarFusion to create epic collages of all of your
              servers' members!
            </p>
            <button
              on:click={() => {
                $step++;
              }}
              class="p-4 mt-4 bg-violet-800 rounded shadow">Next Step</button
            >
          {/if}
          {#if $step === 1}
            <h1 class="text-4xl font-bold">Select a Guild</h1>
            <div class="block">
              <button
                on:click={() => {
                  showInviteModal = true;
                }}
                class="p-4 mt-4 bg-[#5865F2] rounded shadow">Log in/Add Guild</button
              >
              <button
                on:click={() => {
                  step.set(-1);
                }}
                class="p-4 mt-4 bg-neutral-700 rounded shadow"
                >Manually enter Guild ID</button
              >
            </div>
          {/if}
        </div>
      </div>
    {/if}
    {#if $step === 2}
      <Main />
    {/if}
    {#if showInviteModal}
      <div
        in:scale={{ duration: 300 }}
        out:scale={{ duration: 300 }}
        class="fixed inset-0 flex items-center justify-center z-50"
      >
        <div
          class="bg-neutral-800 p-6 w-full max-w-md mx-auto rounded shadow-lg"
        >
          <h2 class="text-xl font-semibold mb-4 text-white">
            Invite AvatarFusion!
          </h2>
          <p class="mb-4 text-gray-200">
            Beware: all user IDs (basically usernames) are accessible to anyone
            who knows the Guild ID. So, if you're part of a super-secret guild
            with celebs, you might want to think twice before proceeding.
          </p>
          <a
            href="https://discord.com/api/oauth2/authorize?client_id=1117058029846794242&permissions=0&redirect_uri={encodeURIComponent("https://avatar.jontes.page")}%2F%3Fstep%3D2&response_type=code&scope=bot%20identify"
            class="bg-violet-400 p-4 mt-2 rounded shadow">Sounds good</a
          >
        </div>
      </div>
    {/if}
  </main>
</div>
