<script lang="ts">
    import { fade, scale } from "svelte/transition";
    import { getState, type Team } from "$lib/state.svelte";

    const state = getState();

    // Tournament structure selection
    let tournament = $derived(state.selectedTournament);
    let matchups = $derived(tournament === 'jcup' ? state.jcupMatchups : state.sierracupMatchups);
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
        <h2 class="text-5xl font-black uppercase tracking-widest text-[#fff] drop-shadow-lg">
            {tournament === 'jcup' ? 'JCUP' : 'SIERRA CUP'}
        </h2>
        <div class="text-[#14f3c7] tracking-[0.4em] uppercase text-sm mt-3">
            Cuadro Final
        </div>
    </div>

    <div class="flex-1 flex justify-center items-center px-10 relative mt-4 gap-12">
        
        <!-- JCUP STRUCTURE (4 TEAMS) -->
        {#if tournament === 'jcup'}
            <div class="flex items-center gap-16 w-full max-w-6xl">
                <!-- Semifinals -->
                <div class="flex flex-col justify-around h-[60%] w-[350px] gap-20">
                    {#each matchups as matchup}
                        <div class="flex flex-col gap-1 w-full relative">
                            {#each [matchup.teamA, matchup.teamB] as team}
                                <div class="h-16 bg-[#020c65] border border-[#02cbf7]/30 flex items-center px-4 rounded gap-4 relative {team ? 'ring-2 ring-[#14f3c7]' : ''}">
                                    {#if team}
                                        <div class="w-10 h-10 flex items-center justify-center p-0.5" in:scale>
                                            <img src={team.image} alt="" class="max-h-full max-w-full object-contain filter drop-shadow-[0_0_8px_rgba(2,203,247,0.4)]" />
                                        </div>
                                        <span class="font-bold text-lg tracking-wider truncate uppercase">{team.name}</span>
                                    {/if}
                                </div>
                            {/each}
                            <!-- Connector to Final -->
                            <div class="absolute top-1/2 -right-8 w-8 border-b-2 border-[#da0a8f] opacity-50"></div>
                        </div>
                    {/each}
                </div>

                <!-- Final Area -->
                <div class="flex-1 flex flex-col items-center gap-8">
                    <div class="w-64 h-32 bg-gradient-to-b from-[#da0a8f]/20 to-transparent border-2 border-[#da0a8f] rounded-xl flex items-center justify-center relative shadow-[0_0_50px_rgba(218,10,143,0.2)]">
                         <span class="text-2xl font-black italic text-white/50 uppercase tracking-widest">GRAN FINAL</span>
                    </div>
                    <img src="/logo jcup2.png" alt="Trophy" class="h-64 object-contain drop-shadow-[0_0_50px_rgba(255,255,255,0.2)]" />
                </div>
            </div>

        <!-- SIERRA CUP STRUCTURE (5 TEAMS) -->
        {:else}
            <div class="flex items-center gap-8 w-full">
                <!-- Play-in Column -->
                <div class="w-[300px] flex flex-col items-center">
                    <div class="text-[10px] text-[#02cbf7] uppercase tracking-[0.3em] mb-4">Fase Previa</div>
                    <div class="flex flex-col gap-1 w-full relative border-2 border-[#02cbf7]/20 p-2 rounded-lg bg-white/5">
                        {#each [matchups[0].teamA, matchups[0].teamB] as team}
                            <div class="h-14 bg-[#020c65] border border-[#02cbf7]/30 flex items-center px-4 rounded gap-4 {team ? 'ring-2 ring-[#14f3c7]' : ''}">
                                {#if team}
                                    <div class="w-8 h-8 flex items-center justify-center p-0.5" in:scale>
                                        <img src={team.image} alt="" class="max-h-full max-w-full object-contain" />
                                    </div>
                                    <span class="font-bold text-sm tracking-widest truncate uppercase">{team.name}</span>
                                {/if}
                            </div>
                        {/each}
                        <div class="absolute top-1/2 -right-10 w-10 border-b-2 border-[#da0a8f] opacity-50"></div>
                    </div>
                </div>

                <!-- Semifinals Column -->
                <div class="flex flex-col justify-around h-[80%] w-[300px] gap-12">
                     <div class="text-[10px] text-[#02cbf7] uppercase tracking-[0.3em] mb-2 text-center">Semifinales</div>
                    
                    <!-- Semi 1 (Winner Play-in vs Other) -->
                    <div class="flex flex-col gap-1 w-full relative">
                        <div class="h-14 bg-[#020c65]/50 border-2 border-dashed border-[#da0a8f]/30 flex items-center px-4 rounded gap-4 italic text-xs text-white/40">
                            GANADOR PLAY-IN
                        </div>
                        <div class="h-14 bg-[#020c65] border border-[#02cbf7]/30 flex items-center px-4 rounded gap-4 {matchups[1].teamB ? 'ring-2 ring-[#14f3c7]' : ''}">
                            {#if matchups[1].teamB}
                                <div class="w-8 h-8 flex items-center justify-center p-0.5" in:scale>
                                    <img src={matchups[1].teamB.image} alt="" class="max-h-full max-w-full object-contain" />
                                </div>
                                <span class="font-bold text-sm tracking-widest truncate uppercase">{matchups[1].teamB.name}</span>
                            {/if}
                        </div>
                        <div class="absolute top-1/2 -right-8 w-8 border-b-2 border-[#14f3c7] opacity-30"></div>
                    </div>

                    <!-- Semi 2 -->
                    <div class="flex flex-col gap-1 w-full relative">
                         {#each [matchups[2].teamA, matchups[2].teamB] as team}
                            <div class="h-14 bg-[#020c65] border border-[#02cbf7]/30 flex items-center px-4 rounded gap-4 {team ? 'ring-2 ring-[#14f3c7]' : ''}">
                                {#if team}
                                    <div class="w-8 h-8 flex items-center justify-center p-0.5" in:scale>
                                        <img src={team.image} alt="" class="max-h-full max-w-full object-contain" />
                                    </div>
                                    <span class="font-bold text-sm tracking-widest truncate uppercase">{team.name}</span>
                                {/if}
                            </div>
                        {/each}
                         <div class="absolute top-1/2 -right-8 w-8 border-b-2 border-[#14f3c7] opacity-30"></div>
                    </div>
                </div>

                <!-- Final Area -->
                <div class="flex-1 flex flex-col items-center">
                    <img src="/logo jcup2.png" alt="Trophy" class="h-48 object-contain mb-8 opacity-40" />
                    <div class="w-full max-w-sm h-40 bg-[#020c65]/80 border-2 border-[#14f3c7] rounded-2xl flex flex-col items-center justify-center gap-4 shadow-[0_0_100px_rgba(20,243,199,0.1)]">
                         <div class="text-xs font-bold text-[#14f3c7] tracking-[0.5em] uppercase">Grand Final</div>
                         <div class="flex items-center gap-8 text-4xl font-black italic text-white/20">
                            <span>???</span>
                            <span class="text-xl">VS</span>
                            <span>???</span>
                         </div>
                    </div>
                </div>
            </div>
        {/if}
    </div>
</div>

