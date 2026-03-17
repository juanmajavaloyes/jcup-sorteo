<script lang="ts">
    import { fade } from "svelte/transition";
    import { onMount } from "svelte";
    import { PUBLIC_PROMO_VIDEO_URL } from "$env/static/public";

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
        src={PUBLIC_PROMO_VIDEO_URL}
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
