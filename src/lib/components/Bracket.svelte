<script lang="ts">
    import { fade, scale } from "svelte/transition";
    import { getState } from "$lib/state.svelte";

    const state = getState();
</script>

<div
    class="fixed inset-0 pt-20 pb-10 px-16 flex flex-col bg-[#000c28]"
    in:fade
    out:fade
>
    <!-- Background overlay -->
    <div class="absolute inset-0 opacity-20 pointer-events-none z-[-1]">
        <img
            src="/logo jcup.png"
            alt=""
            class="w-full h-full object-cover blur-2xl opacity-50 mix-blend-screen"
        />
    </div>

    <div class="text-center mb-8">
        <h2
            class="text-5xl font-black uppercase tracking-widest text-[#fff] drop-shadow-lg"
        >
            Cuadro Final
        </h2>
        <div class="text-[#14f3c7] tracking-[0.4em] uppercase text-sm mt-3">
            Road to Final
        </div>
    </div>

    <!-- Bracket Layout (Quarterfinals -> Semifinals -> Final) -->
    <!-- Assuming 8 teams means 4 matchups for QF -->
    <div class="flex-1 flex justify-between items-center px-10 relative mt-4">
        <!-- Left Wing (Matchups 0 and 1) -->
        <div class="flex flex-col justify-between h-[80%] w-[350px]">
            <!-- Matchup 0 -->
            <div class="flex flex-col gap-1 w-full relative">
                <div
                    class="h-16 bg-[#020c65] border border-[#02cbf7]/30 flex items-center px-4 rounded-l gap-4 relative"
                    class:ring-2={state.matchups[0].teamA}
                    class:ring-[#14f3c7]={state.matchups[0].teamA}
                >
                    {#if state.matchups[0].teamA}
                        <div
                            class="w-10 h-10 flex items-center justify-center p-0.5"
                            in:scale
                        >
                            <img
                                src={state.matchups[0].teamA.image}
                                alt=""
                                class="max-h-full max-w-full object-contain filter drop-shadow-[0_0_8px_rgba(2,203,247,0.4)]"
                            />
                        </div>
                        <span
                            class="font-bold text-lg tracking-wider truncate uppercase"
                            >{state.matchups[0].teamA.name}</span
                        >
                    {/if}
                </div>
                <div
                    class="h-16 bg-[#020c65] border border-[#02cbf7]/30 flex items-center px-4 rounded-l gap-4 relative"
                    class:ring-2={state.matchups[0].teamB}
                    class:ring-[#14f3c7]={state.matchups[0].teamB}
                >
                    {#if state.matchups[0].teamB}
                        <div
                            class="w-10 h-10 flex items-center justify-center p-0.5"
                            in:scale
                        >
                            <img
                                src={state.matchups[0].teamB.image}
                                alt=""
                                class="max-h-full max-w-full object-contain filter drop-shadow-[0_0_8px_rgba(2,203,247,0.4)]"
                            />
                        </div>
                        <span
                            class="font-bold text-lg tracking-wider truncate uppercase"
                            >{state.matchups[0].teamB.name}</span
                        >
                    {/if}
                </div>
                <!-- Connector lines -->
                <div
                    class="absolute top-1/2 -right-8 w-8 border-b-2 border-[#da0a8f] opacity-50"
                ></div>
                <div
                    class="absolute top-1/2 -right-8 h-[calc(100%+80px)] border-r-2 border-[#da0a8f] opacity-50"
                ></div>
            </div>

            <!-- Spacer between Matchup 0 and 1 -->

            <!-- Matchup 1 -->
            <div class="flex flex-col gap-1 w-full relative">
                <div
                    class="h-16 bg-[#020c65] border border-[#02cbf7]/30 flex items-center px-4 rounded-l gap-4"
                    class:ring-2={state.matchups[1].teamA}
                    class:ring-[#14f3c7]={state.matchups[1].teamA}
                >
                    {#if state.matchups[1].teamA}
                        <div
                            class="w-10 h-10 flex items-center justify-center p-0.5"
                            in:scale
                        >
                            <img
                                src={state.matchups[1].teamA.image}
                                alt=""
                                class="max-h-full max-w-full object-contain filter drop-shadow-[0_0_8px_rgba(2,203,247,0.4)]"
                            />
                        </div>
                        <span
                            class="font-bold text-lg tracking-wider truncate uppercase"
                            >{state.matchups[1].teamA.name}</span
                        >
                    {/if}
                </div>
                <div
                    class="h-16 bg-[#020c65] border border-[#02cbf7]/30 flex items-center px-4 rounded-l gap-4"
                    class:ring-2={state.matchups[1].teamB}
                    class:ring-[#14f3c7]={state.matchups[1].teamB}
                >
                    {#if state.matchups[1].teamB}
                        <div
                            class="w-10 h-10 flex items-center justify-center p-0.5"
                            in:scale
                        >
                            <img
                                src={state.matchups[1].teamB.image}
                                alt=""
                                class="max-h-full max-w-full object-contain filter drop-shadow-[0_0_8px_rgba(2,203,247,0.4)]"
                            />
                        </div>
                        <span
                            class="font-bold text-lg tracking-wider truncate uppercase"
                            >{state.matchups[1].teamB.name}</span
                        >
                    {/if}
                </div>
                <!-- Connector lines -->
                <div
                    class="absolute top-1/2 -right-8 w-8 border-b-2 border-[#da0a8f] opacity-50"
                ></div>
                <!-- The vertical connector from M0 comes to here -->
                <div
                    class="absolute top-1/2 -right-8 w-8 border-t-2 border-[#da0a8f] opacity-50"
                ></div>
            </div>
        </div>

        <!-- Center Trophy Area -->
        <div
            class="flex-1 flex justify-center items-center z-10 px-8 relative h-full"
        >
            <!-- Left semi connector -->
            <div
                class="absolute left-0 top-1/2 w-16 border-b-2 border-[#da0a8f] opacity-50"
            ></div>

            <img
                src="/logo jcup2.png"
                alt="Trophy"
                class="h-[70%] max-h-[500px] object-contain drop-shadow-[0_0_50px_rgba(255,255,255,0.2)]"
            />

            <!-- Right semi connector -->
            <div
                class="absolute right-0 top-1/2 w-16 border-b-2 border-[#da0a8f] opacity-50"
            ></div>
        </div>

        <!-- Right Wing (Matchups 2 and 3) -->
        <div class="flex flex-col justify-between h-[80%] w-[350px]">
            <!-- Matchup 2 -->
            <div class="flex flex-col gap-1 w-full relative">
                <div
                    class="h-16 bg-[#020c65] border border-[#02cbf7]/30 flex items-center px-4 rounded-r gap-4 flex-row-reverse"
                    class:ring-2={state.matchups[2].teamA}
                    class:ring-[#14f3c7]={state.matchups[2].teamA}
                >
                    {#if state.matchups[2].teamA}
                        <div
                            class="w-10 h-10 flex items-center justify-center p-0.5"
                            in:scale
                        >
                            <img
                                src={state.matchups[2].teamA.image}
                                alt=""
                                class="max-h-full max-w-full object-contain filter drop-shadow-[0_0_8px_rgba(2,203,247,0.4)]"
                            />
                        </div>
                        <span
                            class="font-bold text-lg tracking-wider truncate uppercase"
                            >{state.matchups[2].teamA.name}</span
                        >
                    {/if}
                </div>
                <div
                    class="h-16 bg-[#020c65] border border-[#02cbf7]/30 flex items-center px-4 rounded-r gap-4 flex-row-reverse"
                    class:ring-2={state.matchups[2].teamB}
                    class:ring-[#14f3c7]={state.matchups[2].teamB}
                >
                    {#if state.matchups[2].teamB}
                        <div
                            class="w-10 h-10 flex items-center justify-center p-0.5"
                            in:scale
                        >
                            <img
                                src={state.matchups[2].teamB.image}
                                alt=""
                                class="max-h-full max-w-full object-contain filter drop-shadow-[0_0_8px_rgba(2,203,247,0.4)]"
                            />
                        </div>
                        <span
                            class="font-bold text-lg tracking-wider truncate uppercase"
                            >{state.matchups[2].teamB.name}</span
                        >
                    {/if}
                </div>
                <div
                    class="absolute top-1/2 -left-8 w-8 border-b-2 border-[#da0a8f] opacity-50"
                ></div>
                <div
                    class="absolute top-1/2 -left-8 h-[calc(100%+80px)] border-l-2 border-[#da0a8f] opacity-50"
                ></div>
            </div>

            <!-- Matchup 3 -->
            <div class="flex flex-col gap-1 w-full relative">
                <div
                    class="h-16 bg-[#020c65] border border-[#02cbf7]/30 flex items-center px-4 rounded-r gap-4 flex-row-reverse"
                    class:ring-2={state.matchups[3].teamA}
                    class:ring-[#14f3c7]={state.matchups[3].teamA}
                >
                    {#if state.matchups[3].teamA}
                        <div
                            class="w-10 h-10 flex items-center justify-center p-0.5"
                            in:scale
                        >
                            <img
                                src={state.matchups[3].teamA.image}
                                alt=""
                                class="max-h-full max-w-full object-contain filter drop-shadow-[0_0_8px_rgba(2,203,247,0.4)]"
                            />
                        </div>
                        <span
                            class="font-bold text-lg tracking-wider truncate uppercase"
                            >{state.matchups[3].teamA.name}</span
                        >
                    {/if}
                </div>
                <div
                    class="h-16 bg-[#020c65] border border-[#02cbf7]/30 flex items-center px-4 rounded-r gap-4 flex-row-reverse"
                    class:ring-2={state.matchups[3].teamB}
                    class:ring-[#14f3c7]={state.matchups[3].teamB}
                >
                    {#if state.matchups[3].teamB}
                        <div
                            class="w-10 h-10 flex items-center justify-center p-0.5"
                            in:scale
                        >
                            <img
                                src={state.matchups[3].teamB.image}
                                alt=""
                                class="max-h-full max-w-full object-contain filter drop-shadow-[0_0_8px_rgba(2,203,247,0.4)]"
                            />
                        </div>
                        <span
                            class="font-bold text-lg tracking-wider truncate uppercase"
                            >{state.matchups[3].teamB.name}</span
                        >
                    {/if}
                </div>
                <div
                    class="absolute top-1/2 -left-8 w-8 border-t-2 border-[#da0a8f] opacity-50"
                ></div>
                <div
                    class="absolute top-1/2 -left-8 w-8 border-b-2 border-[#da0a8f] opacity-50"
                ></div>
            </div>
        </div>
    </div>
</div>
