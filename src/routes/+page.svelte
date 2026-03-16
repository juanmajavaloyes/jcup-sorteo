<script lang="ts">
    import Intro from "$lib/components/Intro.svelte";
    import Presentation from "$lib/components/Presentation.svelte";
    import Draw from "$lib/components/Draw.svelte";
    import Bracket from "$lib/components/Bracket.svelte";
    import VideoPlayer from "$lib/components/VideoPlayer.svelte";
    import MusicPlayer from "$lib/components/MusicPlayer.svelte";
    import { getState } from "$lib/state.svelte";

    const state = getState();
</script>

<main class="w-full h-screen overflow-hidden text-white font-sans bg-[#000c28]">
    <MusicPlayer />
    {#if state.currentScreen === "intro"}
        <Intro />
    {:else if state.currentScreen === "presentation"}
        <Presentation />
    {:else if state.currentScreen === "video"}
        <VideoPlayer />
    {:else if state.currentScreen === "draw"}
        <Draw />
    {:else if state.currentScreen === "bracket"}
        <Bracket />
    {/if}
</main>
