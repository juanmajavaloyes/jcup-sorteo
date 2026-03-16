<script lang="ts">
    import { fade, scale, fly } from "svelte/transition";
    import { getState } from "$lib/state.svelte";
    import { onMount } from "svelte";

    const appState = getState();

    // Carousel logic
    let showGrid = $state(false);
    let carouselIndex = $state(0);
    let isTransitioning = $state(false);

    onMount(() => {
        // Automatically start the carousel
        const interval = setInterval(() => {
            if (carouselIndex < appState.availableTeams.length - 1) {
                isTransitioning = true;
                setTimeout(() => {
                    carouselIndex++;
                    isTransitioning = false;
                }, 300); // Small gap between teams
            } else {
                clearInterval(interval);
                setTimeout(() => {
                    showGrid = true;
                }, 1000); // Wait a second before showing grid
            }
        }, 2200); // Time per team

        return () => clearInterval(interval);
    });
</script>

<div
    class="fixed inset-0 flex flex-col items-center justify-center pt-24 overflow-hidden cursor-none"
    in:fade
    out:fade
>
    <div class="absolute inset-0 z-[-1] opacity-30">
        <img
            src="/logo jcup.png"
            alt="Background"
            class="w-full h-full object-cover blur-3xl mix-blend-screen"
        />
    </div>

    <!-- Carousel View -->
    {#if !showGrid && !appState.presentingTeamId}
        <div
            class="relative w-full h-[60vh] flex items-center justify-center overflow-x-hidden"
            in:fade={{ duration: 500 }}
            out:fade={{ duration: 500 }}
        >
            {#key carouselIndex}
                {#if !isTransitioning}
                    <div
                        class="absolute flex flex-col items-center justify-center w-full h-full"
                        in:fly={{
                            x: 1000,
                            duration: 1000,
                            opacity: 0,
                            delay: 200,
                        }}
                        out:fly={{ x: -1000, duration: 800, opacity: 0 }}
                    >
                        <div
                            class="w-80 h-80 flex items-center justify-center bg-gradient-to-br from-[#020c65]/40 to-[#020c65]/80 backdrop-blur-sm rounded-full border-4 border-[var(--champions-light-blue)] shadow-[0_0_100px_rgba(2,203,247,0.4)] animate-[pulse_3s_ease-in-out_infinite]"
                            in:scale={{
                                duration: 1000,
                                start: 0.1,
                                delay: 200,
                            }}
                        >
                            <img
                                src={appState.availableTeams[carouselIndex].image}
                                alt={appState.availableTeams[carouselIndex].name}
                                class="max-w-[240px] max-h-[240px] object-contain filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.7)]"
                            />
                        </div>
                        <h3
                            in:fly={{
                                y: 50,
                                duration: 800,
                                opacity: 0,
                                delay: 600,
                            }}
                            class="mt-12 text-6xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-[var(--champions-light-blue)] to-white drop-shadow-[0_5px_15px_rgba(255,255,255,0.4)]"
                        >
                            {appState.availableTeams[carouselIndex].name}
                        </h3>
                    </div>
                {/if}
            {/key}
        </div>

        <!-- Player Roster View or Final Grid View -->
    {:else}
        {#key appState.presentingTeamId}
            {#if appState.presentingTeamId}
                {@const team = appState.availableTeams.find(
                    (t) => t.id === appState.presentingTeamId,
                )}
                {#if team}
                    {@const playersList =
                        team.players && team.players.length > 0
                            ? team.players
                            : Array.from(
                                  { length: 10 },
                                  (_, i) => ({ name: `Jugador ${i + 1}`, number: i + 1 }),
                              )}
                    <div
                        class="absolute inset-0 flex pt-32 px-24"
                        in:fade={{ duration: 1500 }}
                        out:fade={{ duration: 1000 }}
                    >
                        <!-- Team Shield Top Left -->
                        <div
                            class="w-[350px] flex flex-col items-center"
                            in:fly={{
                                x: -200,
                                duration: 1500,
                                opacity: 0,
                                delay: 500,
                            }}
                        >
                            <div
                                class="w-80 h-80 flex items-center justify-center bg-gradient-to-br from-[#020c65]/30 to-[#020c65]/70 backdrop-blur-sm rounded-full border-4 border-[var(--champions-light-blue)] shadow-[0_0_80px_rgba(2,203,247,0.4)] animate-[pulse_4s_ease-in-out_infinite]"
                            >
                                <img
                                    src={team.image}
                                    alt={team.name}
                                    class="max-w-[240px] max-h-[240px] object-contain filter drop-shadow-[0_15px_40px_rgba(0,0,0,0.6)]"
                                />
                            </div>
                            <h3
                                class="mt-8 text-4xl font-extrabold text-center uppercase tracking-widest text-[#fff] drop-shadow-md"
                            >
                                {team.name}
                            </h3>
                        </div>

                        <!-- Players Grid -->
                        <div class="flex-1 ml-24">
                            <h2
                                class="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-[var(--champions-light-blue)] mb-10 tracking-[0.2em] border-b border-white/20 pb-4"
                                in:fade={{ duration: 800, delay: 1200 }}
                            >
                                PLANTILLA OFICIAL
                            </h2>

                            <div class="grid grid-cols-2 gap-x-12 gap-y-4">
                                {#each playersList as player, i (player.name + i)}
                                    <div
                                        class="flex items-center gap-4 text-xl font-bold text-white bg-white/5 p-3 rounded-lg border border-white/10"
                                        in:fly|global={{
                                            x: 50,
                                            opacity: 0,
                                            duration: 600,
                                            delay: 1600 + i * 100,
                                        }}
                                    >
                                        <span
                                            class="text-[var(--champions-teal)] font-black text-2xl opacity-80 w-8 text-center"
                                            >{player.number}</span
                                        >
                                        <span class="tracking-wider uppercase truncate"
                                            >{player.name}</span
                                        >
                                    </div>
                                {/each}
                            </div>
                        </div>
                    </div>
                {/if}
            {:else}
                <!-- Standby Grid -->
                <div
                    class="absolute inset-0 flex flex-col items-center pt-20 px-10"
                    in:fade={{ duration: 1000 }}
                    out:fade={{ duration: 800 }}
                >
                    <h2 class="text-5xl font-extrabold uppercase tracking-[0.2em] mb-4 text-[var(--champions-star)] drop-shadow-md">
                        Equipos Participantes
                    </h2>
                    <div class="w-1/2 h-1 bg-gradient-to-r from-transparent via-[var(--champions-light-blue)] to-transparent mb-12"></div>

                    <div class="w-full max-w-7xl flex flex-col gap-12">
                        
                        <!-- JCUP Section -->
                        <div class="flex flex-col items-center">
                            <h3 class="text-2xl font-bold text-[#14f3c7] tracking-[0.5em] uppercase mb-8 opacity-80 decoration-2 underline-offset-8">
                                JCUP
                            </h3>
                            <div class="grid grid-cols-4 gap-12 w-full">
                                {#each appState.availableTeams.filter(t => t.tournament === 'jcup') as team, i (team.id)}
                                    <div
                                        class="flex flex-col items-center"
                                        in:scale={{ duration: 600, delay: i * 100, start: 0.8 }}
                                        style="animation: float 3.5s ease-in-out infinite; animation-delay: {i * 450}ms"
                                    >
                                        <div class="glow-teal relative w-36 h-36 flex items-center justify-center bg-white/5 backdrop-blur-[2px] rounded-full border border-[var(--champions-light-blue)]/30"
                                            style="animation: glowTeal 4s ease-in-out infinite; animation-delay: {i * 450}ms">
                                            <img src={team.image} alt={team.name} class="max-w-[100px] max-h-[100px] object-contain filter drop-shadow-2xl" />
                                        </div>
                                        <div class="mt-4 text-lg font-bold tracking-wider text-center bg-gradient-to-b from-white to-[var(--champions-light-blue)] bg-clip-text text-transparent uppercase">
                                            {team.name}
                                        </div>
                                    </div>
                                {/each}
                            </div>
                        </div>

                        <!-- SIERRA CUP Section -->
                        <div class="flex flex-col items-center">
                            <h3 class="text-2xl font-bold text-[#da0a8f] tracking-[0.5em] uppercase mb-8 opacity-80 decoration-2 underline-offset-8">
                                Sierra Cup
                            </h3>
                            <div class="grid grid-cols-5 gap-8 w-full">
                                {#each appState.availableTeams.filter(t => t.tournament === 'sierracup') as team, i (team.id)}
                                    <div
                                        class="flex flex-col items-center"
                                        in:scale={{ duration: 600, delay: 400 + i * 100, start: 0.8 }}
                                        style="animation: float 3.5s ease-in-out infinite; animation-delay: {(i + 4) * 380}ms"
                                    >
                                        <div class="relative w-32 h-32 flex items-center justify-center bg-white/5 backdrop-blur-[2px] rounded-full border border-[var(--champions-light-blue)]/30"
                                            style="animation: glowPink 4s ease-in-out infinite; animation-delay: {(i + 4) * 380}ms">
                                            <img src={team.image} alt={team.name} class="max-w-[85px] max-h-[85px] object-contain filter drop-shadow-2xl" />
                                        </div>
                                        <div class="mt-4 text-base font-bold tracking-wider text-center bg-gradient-to-b from-white to-[var(--champions-light-blue)] bg-clip-text text-transparent uppercase">
                                            {team.name}
                                        </div>
                                    </div>
                                {/each}
                            </div>
                        </div>
                    </div>
                </div>
            {/if}
        {/key}
    {/if}
</div>

<style>
    @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-14px); }
    }

    @keyframes glowTeal {
        0%, 100% {
            box-shadow: 0 0 20px rgba(2, 203, 247, 0.15);
            border-color: rgba(2, 203, 247, 0.3);
        }
        50% {
            box-shadow: 0 0 55px rgba(20, 243, 199, 0.55), 0 0 20px rgba(2, 203, 247, 0.3);
            border-color: rgba(20, 243, 199, 0.9);
        }
    }

    @keyframes glowPink {
        0%, 100% {
            box-shadow: 0 0 20px rgba(218, 10, 143, 0.15);
            border-color: rgba(2, 203, 247, 0.3);
        }
        50% {
            box-shadow: 0 0 55px rgba(218, 10, 143, 0.55), 0 0 20px rgba(218, 10, 143, 0.3);
            border-color: rgba(218, 10, 143, 0.9);
        }
    }
</style>
