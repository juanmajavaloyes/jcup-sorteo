<script lang="ts">
    import { fade, scale } from "svelte/transition";
    import { getState } from "$lib/state.svelte";

    const state = getState();

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
        <img src="/logo jcup.png" alt="" class="w-full h-full object-cover blur-2xl opacity-50 mix-blend-screen" />
    </div>

    <div class="text-center mb-8">
        <h2 class="text-5xl font-black uppercase tracking-widest text-[#fff] drop-shadow-lg">
            {tournament === 'jcup' ? 'JCUP' : 'SIERRA CUP'}
        </h2>
        <div class="text-[#14f3c7] tracking-[0.4em] uppercase text-sm mt-3">Cuadro Final</div>
    </div>

    <div class="flex-1 flex justify-center items-center px-10 relative">

        <!-- ── JCUP (4 equipos) ── -->
        {#if tournament === 'jcup'}
            <div class="flex items-center w-full max-w-5xl h-[500px]">

                <!-- Semis -->
                <div class="flex flex-col justify-around h-full w-[420px] flex-shrink-0">
                    {#each matchups as matchup}
                        <div class="flex flex-col gap-1.5 w-full">
                            {#each [matchup.teamA, matchup.teamB] as team}
                                <div class="h-20 bg-[#020c65] border border-[#02cbf7]/20 flex items-center px-5 rounded-xl gap-4 transition-all duration-500
                                    {team ? 'ring-2 ring-[#14f3c7] shadow-[0_0_25px_rgba(20,243,199,0.2)]' : 'opacity-50'}">
                                    {#if team}
                                        <div class="w-12 h-12 flex-shrink-0 flex items-center justify-center" in:scale={{ duration: 500 }}>
                                            <img src={team.image} alt="" class="max-h-full max-w-full object-contain filter drop-shadow-[0_0_10px_rgba(2,203,247,0.5)]" />
                                        </div>
                                        <span class="font-bold text-xl tracking-wider truncate uppercase">{team.name}</span>
                                    {:else}
                                        <div class="w-12 h-12 flex-shrink-0 rounded-full bg-white/5 border border-white/10"></div>
                                        <span class="text-white/20 text-sm italic">Por determinar</span>
                                    {/if}
                                </div>
                            {/each}
                        </div>
                    {/each}
                </div>

                <!-- Connector: stubs at 25 % y 75 %, vertical y mitad -->
                <div class="relative h-full w-16 flex-shrink-0">
                    <div class="absolute left-0 right-0 border-t border-[#da0a8f]/60" style="top:25%"></div>
                    <div class="absolute left-0 right-0 border-t border-[#14f3c7]/60" style="top:75%"></div>
                    <div class="absolute right-0 w-px bg-gradient-to-b from-[#da0a8f] to-[#14f3c7] opacity-60" style="top:25%;height:50%"></div>
                </div>

                <!-- Final: línea flex-1 + caja + espaciador -->
                <div class="flex-1 flex items-center">
                    <div class="flex-1 border-t border-white/30"></div>
                    <div class="relative w-72 h-52 bg-gradient-to-br from-[#020c65]/90 to-[#da0a8f]/10 border-2 border-[#da0a8f] rounded-2xl flex flex-col items-center justify-center overflow-hidden shadow-[0_0_80px_rgba(218,10,143,0.3)]">
                        <img src="/logo jcup2.png" alt="" class="absolute inset-0 w-full h-full object-contain opacity-[0.06]" />
                        <span class="relative z-10 text-xs font-bold text-[#da0a8f] tracking-[0.5em] uppercase mb-4">Gran Final</span>
                        <div class="relative z-10 flex items-center gap-5 font-black italic text-white/20">
                            <span class="text-5xl">?</span>
                            <span class="text-lg font-normal">VS</span>
                            <span class="text-5xl">?</span>
                        </div>
                    </div>
                    <div class="flex-1"></div>
                </div>
            </div>

        <!-- ── SIERRA CUP (5 equipos) ── -->
        {:else}
            <!--
                Posicionamiento absoluto para alineación exacta.
                Play-in center (top=40, center=108px) = GANADOR PLAY-IN center (semi1 top=80, center=108px).
                Semi 1 center=138px, Semi 2 center=334px → vertical mid=236px para la Final.
            -->
            <div class="relative w-full h-[420px]">

                <!-- Labels -->
                <div class="absolute text-[10px] text-[#02cbf7] uppercase tracking-[0.3em] text-center" style="top:10px; left:0; width:240px">Fase Previa</div>
                <div class="absolute text-[10px] text-[#02cbf7] uppercase tracking-[0.3em] text-center" style="top:55px; left:300px; width:260px">Semifinales</div>

                <!-- Play-in: top=40px → center de las 2 cartas = 108px -->
                <div class="absolute flex flex-col gap-1 border-2 border-[#02cbf7]/20 p-2 rounded-lg bg-white/5" style="top:40px; left:0; width:240px">
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
                </div>

                <!-- Semi 1: top=80px → GANADOR center=108px, semi center=138px -->
                <div class="absolute flex flex-col gap-1" style="top:80px; left:300px; width:260px">
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
                </div>

                <!-- Semi 2: top=276px → center=334px -->
                <div class="absolute flex flex-col gap-1" style="top:276px; left:300px; width:260px">
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
                </div>

                <!-- Línea magenta: play-in → GANADOR PLAY-IN (y=108px) -->
                <div class="absolute border-t-2 border-[#da0a8f]/70" style="top:107px; left:240px; width:60px"></div>

                <!-- Líneas bracket semis → final -->
                <!-- Semi 1 right → y=138 -->
                <div class="absolute border-t border-[#14f3c7]/60" style="top:137px; left:560px; width:40px"></div>
                <!-- Semi 2 right → y=334 -->
                <div class="absolute border-t border-[#14f3c7]/60" style="top:333px; left:560px; width:40px"></div>
                <!-- Vertical de y=138 a y=334 en x=600 -->
                <div class="absolute w-px bg-gradient-to-b from-[#14f3c7] to-[#14f3c7] opacity-50" style="top:138px; left:600px; height:196px"></div>
                <!-- Horizontal desde midpoint (y=236) hacia la final -->
                <div class="absolute border-t border-[#14f3c7]/50" style="top:235px; left:600px; width:60px"></div>

                <!-- Final: center=236px → top=156px, h=160px -->
                <div class="absolute flex flex-col items-center justify-center gap-4 bg-[#020c65]/80 border-2 border-[#14f3c7] rounded-2xl shadow-[0_0_80px_rgba(20,243,199,0.15)]" style="top:156px; left:660px; width:280px; height:160px">
                    <div class="text-xs font-bold text-[#14f3c7] tracking-[0.5em] uppercase">Grand Final</div>
                    <div class="flex items-center gap-6 text-4xl font-black italic text-white/20">
                        <span>???</span>
                        <span class="text-lg font-normal">VS</span>
                        <span>???</span>
                    </div>
                </div>

            </div>
        {/if}
    </div>
</div>
