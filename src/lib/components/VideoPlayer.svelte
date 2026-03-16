<script lang="ts">
    import { fade } from "svelte/transition";
    import { onMount } from "svelte";

    const videoUrl = "https://qhfcwxl0t27szjhc.public.blob.vercel-storage.com/promo.mp4";

    let videoElement: HTMLVideoElement;

    onMount(() => {
        if (videoElement) {
            videoElement.play().catch(e => console.error("Error playing video:", e));
        }
    });
</script>

<div
    class="fixed inset-0 bg-black flex items-center justify-center z-[100]"
    in:fade={{ duration: 800 }}
    out:fade={{ duration: 800 }}
>
    <!-- svelte-ignore a11y_media_has_caption -->
    <video
        bind:this={videoElement}
        src={videoUrl}
        class="w-full h-full object-contain"
        controls={false}
        autoplay
        playsinline
        preload="auto"
    ></video>
</div>

<style>
    video {
        background: black;
    }
</style>
