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
    class="fixed inset-0 flex flex-col items-center justify-center pt-24 overflow-hidden"
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
            class="relative w-full h-[60vh] flex items-center justify-center overflow-hidden"
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
                            class="w-80 h-80 flex items-center justify-center bg-[#020c65]/80 rounded-full border-4 border-[var(--champions-light-blue)] shadow-[0_0_80px_rgba(2,203,247,0.6)] animate-[pulse_2s_ease-in-out_infinite]"
                            in:scale={{
                                duration: 1000,
                                start: 0.1,
                                delay: 200,
                            }}
                        >
                            <img
                                src={appState.availableTeams[carouselIndex]
                                    .image}
                                alt={appState.availableTeams[carouselIndex]
                                    .name}
                                class="max-w-[220px] max-h-[220px] object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
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
                                  (_, i) => `Jugador ${i + 1}`,
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
                                class="w-80 h-80 flex items-center justify-center bg-[#020c65]/80 rounded-full border-4 border-[var(--champions-light-blue)] shadow-[0_0_80px_rgba(2,203,247,0.6)] animate-[pulse_2s_ease-in-out_infinite]"
                            >
                                <img
                                    src={team.image}
                                    alt={team.name}
                                    class="max-w-[220px] max-h-[220px] object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
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

                            <div class="grid grid-cols-2 gap-x-16 gap-y-6">
                                {#each playersList as player, i (player + i)}
                                    <div
                                        class="flex items-center gap-6 text-2xl font-bold text-white bg-white/5 p-4 rounded-lg border border-white/10"
                                        in:fly|global={{
                                            x: 50,
                                            opacity: 0,
                                            duration: 600,
                                            delay: 1600 + i * 150,
                                        }}
                                    >
                                        <span
                                            class="text-[var(--champions-teal)] font-black text-3xl opacity-80 w-8"
                                            >{i + 1}</span
                                        >
                                        <span class="tracking-wider uppercase"
                                            >{player}</span
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
                    class="absolute inset-0 flex flex-col items-center pt-24"
                    in:fade={{ duration: 1000 }}
                    out:fade={{ duration: 800 }}
                >
                    <h2
                        class="text-5xl font-extrabold uppercase tracking-[0.2em] mb-4 text-[var(--champions-star)] drop-shadow-md"
                    >
                        Equipos Participantes
                    </h2>
                    <div
                        class="w-2/3 h-1 bg-gradient-to-r from-transparent via-[var(--champions-light-blue)] to-transparent mb-16"
                    ></div>

                    <div
                        class="grid grid-cols-4 gap-x-16 gap-y-12 max-w-6xl w-full"
                    >
                        {#each appState.availableTeams as team, i (team.id)}
                            <div
                                class="flex flex-col items-center group transition-all"
                                in:scale={{
                                    duration: 600,
                                    delay: i * 100,
                                    start: 0.8,
                                }}
                            >
                                <div
                                    class="relative w-40 h-40 flex items-center justify-center bg-[#020c65]/50 rounded-full border border-[var(--champions-light-blue)]/30 group-hover:border-[var(--champions-teal)] group-hover:scale-110 transition-all duration-500 shadow-[0_0_20px_rgba(2,203,247,0.2)] group-hover:shadow-[0_0_30px_rgba(20,243,199,0.5)]"
                                >
                                    <img
                                        src={team.image}
                                        alt={team.name}
                                        class="max-w-[120px] max-h-[120px] object-contain drop-shadow-xl"
                                    />
                                </div>
                                <div
                                    class="mt-6 text-xl font-bold tracking-wider text-center bg-gradient-to-b from-white to-[var(--champions-light-blue)] bg-clip-text text-transparent uppercase"
                                >
                                    {team.name}
                                </div>
                            </div>
                        {/each}
                    </div>
                </div>
            {/if}
        {/key}
    {/if}
</div>
