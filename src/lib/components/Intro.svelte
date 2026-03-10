<script lang="ts">
    import { fade } from "svelte/transition";
</script>

<div
    class="fixed inset-0 bg-black flex items-center justify-center"
    in:fade
    out:fade
>
    <video
        src="/intro.mp4"
        autoplay
        loop
        muted
        class="w-full h-full object-cover opacity-80"
    ></video>

    <div
        class="absolute top-16 inset-x-0 flex justify-center items-center pointer-events-none px-8"
    >
        <div
            class="bg-[var(--champions-blue-dark)]/70 backdrop-blur-md border border-[var(--champions-light-blue)]/30 px-20 py-8 rounded-3xl shadow-[0_0_50px_rgba(2,203,247,0.3)]"
        >
            <h1
                class="text-7xl font-sans font-black tracking-[0.4em] text-[var(--champions-light-blue)] drop-shadow-[0_2px_10px_rgba(255,255,255,0.4)] uppercase italic ml-4"
            >
                SORTEO
            </h1>
        </div>
    </div>
</div>
