<script lang="ts">
    import { getState } from "$lib/state.svelte";
    import { onMount } from "svelte";

    const appState = getState();
    let audio: HTMLAudioElement;
    let isBlocked = $state(false);

    onMount(() => {
        audio = new Audio("/Canción Sorteo- Gonzalo Naranjo.mp3");
        audio.loop = true;
        audio.volume = appState.musicVolume;

        return () => {
            if (audio) {
                audio.pause();
                audio.src = "";
            }
        };
    });

    // Control play/pause
    $effect(() => {
        if (!audio) return;
        
        if (appState.isMusicPlaying) {
            audio.play().catch(e => {
                console.warn("Audio blocked by browser. Awaiting interaction.", e);
                isBlocked = true;
            });
        } else {
            audio.pause();
            isBlocked = false;
        }
    });

    // Control volume
    $effect(() => {
        if (!audio) return;
        audio.volume = appState.musicVolume;
    });

    function tryUnlock() {
        if (appState.isMusicPlaying && audio) {
            audio.play().then(() => {
                isBlocked = false;
            }).catch(e => console.error("Still blocked:", e));
        }
    }
</script>

{#if isBlocked && appState.isMusicPlaying}
    <button 
        onclick={tryUnlock}
        class="fixed bottom-4 right-4 z-[9999] bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-bounce font-bold text-sm"
    >
        🔊 Activar Sonido
    </button>
{/if}

<svelte:window onclick={tryUnlock} />
