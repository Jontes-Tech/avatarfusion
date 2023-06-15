<script lang="ts">
  import { onMount } from "svelte";
  import { step } from "./stores";

  let loaded = false;
  onMount(() => {
    const url = new URL(location.href);
    const guildid = url.searchParams.get("guild_id");
    if (!guildid) {
      step.set(1);
      return;
    }
    let doFetch = async () => {
      await fetch("https://avatarapi.jontes.page/guild/" + guildid + "?allowBots=true")
        .then((res) => res.json())
        .then((data) => {
          guild = data;
          loaded = true;
        });
    };
    doFetch();
  });
  // Fetch the guild's members from the API
  interface Guild {
    members: Array<string>;
    guild: string;
    icon: string;
  }
  let guild: Guild;
  let drawn = false;
  function draw() {
    let margin = 30;
    const c = document.querySelector("canvas");
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#36393e";
    ctx.fillRect(0, 0, 1920, 1080);

    const members = guild.members;
    const aspectRatio = 16 / 9;
    const totalMembers = members.length;

    const numCols = Math.round(Math.sqrt(totalMembers * aspectRatio));
    const numRows = Math.ceil(totalMembers / numCols);
    const imgWidth = (1920 - (numCols + 1) * margin) / numCols;
    const imgHeight = (1080 - (numRows + 1) * margin) / numRows;
    const imgSize = Math.min(imgWidth, imgHeight);

    members.forEach((member, index) => {
      let img = new Image();
      img.src = member;

      const row = Math.floor(index / numCols);
      const col = index % numCols;

      const xpos = col * (imgSize + margin) + margin;
      const ypos = row * (imgSize + margin) + margin;

      img.onload = () => {
        ctx.drawImage(img, xpos, ypos, imgSize, imgSize);
      };
    });

    drawn = true;
  }
</script>

<div class="m-8">
  {#if !loaded}
    We're loading your guild's members, please wait...
  {:else}
    <div class="flex flex-row">
      <img src={guild.icon} alt="" class="h-12 mr-2 rounded-full" />
      <h1 class="text-4xl text-white font-bold">{guild.guild}</h1>
    </div>
    Your guild has {guild.members.length} members! {#if !drawn}Please click the
      canvas to generate your collage.{:else}Rightclick to save the image!{/if}
    <canvas
      on:click={draw}
      width="1920"
      height="1080"
      class="w-full mt-2 border border-white"
    >
      Your browser does not support the HTML canvas tag, too bad!</canvas
    >
  {/if}
</div>
