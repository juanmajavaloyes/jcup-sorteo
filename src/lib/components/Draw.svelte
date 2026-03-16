<script lang="ts">
    import { fade, scale } from "svelte/transition";
    import { getState } from "$lib/state.svelte";

    const state = getState();

    // The current pairing being drawn based on selected tournament
    let currentMatchups = $derived(
        state.selectedTournament === 'jcup' ? state.jcupMatchups : state.sierracupMatchups
    );
    let currentMatchup = $derived(currentMatchups[state.currentMatchupIndex]);

    // Unassigned teams count visually for current tournament
    let unassignedTeamsCount = $derived(
        state.availableTeams.filter(t => t.tournament === state.selectedTournament).length -
            currentMatchups
                .flatMap((m) => [m.teamA, m.teamB])
                .filter((t) => t !== null).length,
    );
</script>

<div
    class="fixed inset-0 pt-20 px-10 flex flex-col items-center bg-[#000c28]"
    in:fade
    out:fade
>
    <!-- Background styling typical of Champions League -->
    <div
        class="absolute inset-0 bg-gradient-to-br from-[#020c65] to-[#da0a8f]/20 opacity-40 z-[-1]"
    ></div>
    <div
        class="absolute top-[20%] left-0 w-full h-[60%] flex items-center justify-center opacity-10"
    >
        <img
            src="/logo jcup2.png"
            alt="watermark"
            class="h-full object-contain"
        />
    </div>

    <!-- Header -->
    <div
        class="w-full flex justify-between items-end mb-8 border-b-2 border-white/20 pb-4"
    >
        <div class="flex items-center gap-4">
            <div class="relative flex h-4 w-4">
                <span
                    class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"
                ></span>
                <span
                    class="relative inline-flex rounded-full h-4 w-4 bg-red-600"
                ></span>
            </div>
            <h2
                class="text-3xl font-bold uppercase tracking-widest text-[#14f3c7] animate-[pulse_2s_ease-in-out_infinite]"
            >
                {state.selectedTournament === 'jcup' ? 'JCUP' : 'SIERRA CUP'} - LIVE
            </h2>
        </div>
        <span class="text-xl font-light tracking-wider opacity-80"
            >Equipos en el bombo: {unassignedTeamsCount}</span
        >
    </div>

    {#if currentMatchup}
        <div class="flex-1 w-full flex flex-col items-center justify-center">
            <h3
                class="text-2xl tracking-[0.3em] font-light mb-12 text-[#02cbf7] uppercase"
            >
                {currentMatchup.label}
            </h3>

            <div
                class="flex items-center justify-center gap-16 w-full max-w-5xl"
            >
                <!-- Team A Reveal -->
                <div
                    class="w-[45%] h-[300px] bg-gradient-to-b from-white/10 to-transparent border-t-2 border-[var(--champions-magenta)] rounded-t-xl flex flex-col items-center justify-center relative overflow-hidden group shadow-[0_-10px_40px_rgba(218,10,143,0.1)] transition-all"
                >
                    {#if currentMatchup.teamA}
                        <div
                            in:scale={{ duration: 600, start: 0.5 }}
                            class="flex flex-col items-center z-10"
                        >
                            <img
                                src={currentMatchup.teamA.image}
                                alt={currentMatchup.teamA.name}
                                class="w-48 h-48 object-contain filter drop-shadow-[0_15px_40px_rgba(0,0,0,0.6)]"
                            />
                            <span
                                class="mt-6 text-3xl font-bold tracking-widest uppercase"
                                >{currentMatchup.teamA.name}</span
                            >
                        </div>
                    {:else if state.revealingTeam === "A"}
                        <div
                            class="absolute inset-0 flex items-center justify-center"
                            in:fade
                        >
                            <div
                                class="w-32 h-32 rounded-full border-4 border-t-[#02cbf7] animate-spin"
                            ></div>
                        </div>
                    {/if}
                    <div
                        class="absolute bottom-[-50%] w-[200%] h-full bg-[#14f3c7] opacity-5 blur-3xl"
                    ></div>
                </div>

                <!-- VS text -->
                <div
                    class="text-5xl font-extrabold italic text-white/40 font-serif"
                >
                    VS
                </div>

                <!-- Team B Reveal -->
                <div
                    class="w-[45%] h-[300px] bg-gradient-to-b from-white/10 to-transparent border-t-2 border-[#14f3c7] rounded-t-xl flex flex-col items-center justify-center relative overflow-hidden group shadow-[0_-10px_40px_rgba(20,243,199,0.1)] transition-all"
                >
                    {#if currentMatchup.teamB}
                        <div
                            in:scale={{ duration: 600, start: 0.5 }}
                            class="flex flex-col items-center z-10"
                        >
                            <img
                                src={currentMatchup.teamB.image}
                                alt={currentMatchup.teamB.name}
                                class="w-48 h-48 object-contain filter drop-shadow-[0_15px_40px_rgba(0,0,0,0.6)]"
                            />
                            <span
                                class="mt-6 text-3xl font-bold tracking-widest uppercase"
                                >{currentMatchup.teamB.name}</span
                            >
                        </div>
                    {:else if state.revealingTeam === "B"}
                        <div
                            class="absolute inset-0 flex items-center justify-center"
                            in:fade
                        >
                            <div
                                class="w-32 h-32 rounded-full border-4 border-t-[#da0a8f] animate-spin"
                            ></div>
                        </div>
                    {/if}
                    <div
                        class="absolute bottom-[-50%] w-[200%] h-full bg-[#02cbf7] opacity-5 blur-3xl"
                    ></div>
                </div>
            </div>
        </div>
    {/if}
</div>

