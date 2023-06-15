<script>
  import { step } from "./stores";
  export let number;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<li
  class={"sidebar-icon hover:bg-violet-600 " +
    ($step === number ? "bg-violet-600" : "bg-gray-800")}
  on:click={() => {
    step.set(number);
  }}
>
  {number}
</li>
