<script lang="ts">
    import { getState, updateState, type Team, type TournamentType, type ScreenState } from "$lib/state.svelte";

    const state = getState();

    function setScreen(screen: ScreenState) {
        updateState((s) => {
            s.currentScreen = screen;
        });
    }

    function setTournament(tournament: TournamentType) {
        updateState((s) => {
            s.selectedTournament = tournament;
            s.currentMatchupIndex = 0;
            s.revealingTeam = null;
        });
    }

    // Matchups based on selected tournament
    let currentMatchups = $derived(
        state.selectedTournament === 'jcup' ? state.jcupMatchups : state.sierracupMatchups
    );

    // Teams that haven't been picked yet for the SELECTED tournament
    let availableForDraw = $derived(
        state.availableTeams.filter(
            (t) =>
                t.tournament === state.selectedTournament &&
                !currentMatchups.some(
                    (m) => m.teamA?.id === t.id || m.teamB?.id === t.id,
                ),
        ),
    );

    function pickNextMatchup(teamId: string) {
        const team = state.availableTeams.find((t) => t.id === teamId);
        if (!team) return;

        updateState((s) => {
            const matchups = s.selectedTournament === 'jcup' ? s.jcupMatchups : s.sierracupMatchups;
            const current = matchups[s.currentMatchupIndex];
            
            const isSierraSemi1 = s.selectedTournament === 'sierracup' && s.currentMatchupIndex === 1;

            if (!current.teamA && !isSierraSemi1) {
                current.teamA = team;
                s.revealingTeam = "A";
                setTimeout(() => {
                    updateState((s2) => { s2.revealingTeam = null; });
                }, 2000);
            } else if (!current.teamB) {
                current.teamB = team;
                s.revealingTeam = "B";
                setTimeout(() => {
                    updateState((s2) => { s2.revealingTeam = null; });
                }, 2000);
            }
        });
    }

    function advanceMatchup() {
        updateState((s) => {
            const matchups = s.selectedTournament === 'jcup' ? s.jcupMatchups : s.sierracupMatchups;
            const current = matchups[s.currentMatchupIndex];
            const isSierraSemi1 = s.selectedTournament === 'sierracup' && s.currentMatchupIndex === 1;

            if (
                s.currentMatchupIndex < matchups.length - 1 &&
                (current.teamA || isSierraSemi1) &&
                current.teamB
            ) {
                s.currentMatchupIndex++;
                s.revealingTeam = null;
            }
        });
    }

    function resetDraw() {
        if (!confirm("¿Seguro que quieres resetear TODO el sorteo? Se perderán todos los emparejamientos.")) return;
        updateState((s) => {
            s.currentScreen = "intro";
            s.currentMatchupIndex = 0;
            s.revealingTeam = null;
            s.jcupMatchups.forEach(m => { m.teamA = null; m.teamB = null; });
            s.sierracupMatchups.forEach(m => { m.teamA = null; m.teamB = null; });
        });
    }
</script>

<div class="min-h-screen h-screen overflow-y-auto bg-gray-900 text-white p-8">
    <div class="max-w-4xl mx-auto flex flex-col gap-8 pb-16">
        <div class="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h1 class="text-3xl font-bold mb-2">Panel de Control: Director</h1>
                <div class="flex items-center gap-6">
                    <div class="flex items-center gap-4 bg-gray-700/50 p-2 px-4 rounded-lg">
                        <span class="text-xs font-bold uppercase text-gray-400">Volumen Música</span>
                        <input 
                            type="range" 
                            min="0" 
                            max="1" 
                            step="0.01" 
                            value={state.musicVolume}
                            oninput={(e) => updateState(s => { s.musicVolume = parseFloat(e.currentTarget.value); })}
                            class="w-32 accent-green-500"
                        />
                        <span class="text-xs font-mono w-8">{Math.round(state.musicVolume * 100)}%</span>
                    </div>

                    <button
                        onclick={() => updateState(s => { s.isMusicPlaying = !s.isMusicPlaying; })}
                        class="px-4 py-2 {state.isMusicPlaying ? 'bg-green-600 hover:bg-green-500' : 'bg-orange-600 hover:bg-orange-500'} rounded text-sm font-semibold transition-colors flex items-center gap-2"
                    >
                        <span>{state.isMusicPlaying ? '⏸ Pausar Música' : '▶ Sonar Canción'}</span>
                    </button>
                    <button
                        onclick={resetDraw}
                        class="px-4 py-2 bg-red-600 hover:bg-red-500 rounded text-sm font-semibold transition-colors"
                    >
                        Resetear Sorteos
                    </button>
                </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Scene Control -->
            <div class="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h2 class="text-xl font-bold mb-4">1. Escena Actual</h2>
                <div class="grid grid-cols-2 gap-4">
                    <button
                        onclick={() => setScreen("intro")}
                        class="px-4 py-3 rounded font-bold transition-colors {state.currentScreen === 'intro' ? 'bg-blue-600 ring-2 ring-blue-300' : 'bg-gray-700 hover:bg-gray-600'}"
                    >
                        Intro
                    </button>
                    <button
                        onclick={() => setScreen("presentation")}
                        class="px-4 py-3 rounded font-bold transition-colors {state.currentScreen === 'presentation' ? 'bg-blue-600 ring-2 ring-blue-300' : 'bg-gray-700 hover:bg-gray-600'}"
                    >
                        Presentación
                    </button>
                    <button
                        onclick={() => setScreen("video")}
                        class="px-4 py-3 rounded font-bold transition-colors {state.currentScreen === 'video' ? 'bg-purple-600 ring-2 ring-purple-300' : 'bg-gray-700 hover:bg-gray-600'}"
                    >
                        Video Promocional
                    </button>
                    <button
                        onclick={() => setScreen("draw")}
                        class="px-4 py-3 rounded font-bold transition-colors {state.currentScreen === 'draw' ? 'bg-blue-600 ring-2 ring-blue-300' : 'bg-gray-700 hover:bg-gray-600'}"
                    >
                        Sorteo
                    </button>
                    <button
                        onclick={() => setScreen("bracket")}
                        class="px-4 py-3 rounded font-bold transition-colors {state.currentScreen === 'bracket' ? 'bg-blue-600 ring-2 ring-blue-300' : 'bg-gray-700 hover:bg-gray-600'}"
                    >
                        Cuadro
                    </button>
                </div>
            </div>

            <!-- Tournament Selection -->
            <div class="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h2 class="text-xl font-bold mb-4">2. Seleccionar Torneo</h2>
                <div class="grid grid-cols-2 gap-4">
                    <button
                        onclick={() => setTournament("jcup")}
                        class="px-4 py-3 rounded font-bold transition-colors {state.selectedTournament === 'jcup' ? 'bg-indigo-600 ring-2 ring-indigo-300' : 'bg-gray-700 hover:bg-gray-600'}"
                    >
                        JCUP (4 eq)
                    </button>
                    <button
                        onclick={() => setTournament("sierracup")}
                        class="px-4 py-3 rounded font-bold transition-colors {state.selectedTournament === 'sierracup' ? 'bg-indigo-600 ring-2 ring-indigo-300' : 'bg-gray-700 hover:bg-gray-600'}"
                    >
                        SIERRA CUP (5 eq)
                    </button>
                </div>
            </div>
        </div>

        {#if state.currentScreen === "presentation"}
            <div class="bg-indigo-900/50 border border-indigo-600 p-6 rounded-xl">
                <h2 class="text-xl font-bold mb-4">Presentación de Jugadores</h2>
                <div class="flex flex-wrap gap-4">
                    {#each state.availableTeams as team}
                        <button
                            onclick={() => updateState((s) => { s.presentingTeamId = team.id; })}
                            class="flex flex-col items-center gap-2 p-3 bg-indigo-800/40 hover:bg-indigo-700 rounded-lg border transition-all {state.presentingTeamId === team.id ? 'border-white ring-4 ring-indigo-400 bg-indigo-600 scale-105' : 'border-indigo-500/50'}"
                        >
                            <img src={team.image} alt="" class="w-12 h-12 object-contain" />
                            <span class="text-[10px] font-bold uppercase">{team.name}</span>
                        </button>
                    {/each}
                </div>
                <div class="mt-6 flex justify-end">
                    <button
                        onclick={() => updateState((s) => { s.presentingTeamId = null; })}
                        disabled={!state.presentingTeamId}
                        class="px-4 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 rounded text-sm font-bold"
                    >
                        Cerrar Presentación
                    </button>
                </div>
            </div>
        {/if}

        {#if state.currentScreen === "draw"}
            <div class="bg-blue-900/50 border border-blue-600 p-6 rounded-xl">
                <h2 class="text-xl font-bold mb-2">
                    Sorteo en Directo: {state.selectedTournament.toUpperCase()}
                </h2>
                <p class="text-blue-300 text-sm mb-6 uppercase tracking-widest">
                    {currentMatchups[state.currentMatchupIndex].label}
                </p>

                <div class="flex gap-8 mb-8 items-center bg-black/40 p-6 rounded-lg border border-white/10">
                    <div class="flex-1 text-center">
                        <span class="text-xs text-gray-400 uppercase tracking-widest block mb-2">Local</span>
                        <div class="text-2xl font-bold {currentMatchups[state.currentMatchupIndex].teamA ? 'text-white' : 'text-gray-600'}">
                            {currentMatchups[state.currentMatchupIndex].teamA?.name || "???"}
                        </div>
                    </div>
                    <div class="text-2xl font-black text-blue-500/50 italic">VS</div>
                    <div class="flex-1 text-center">
                        <span class="text-xs text-gray-400 uppercase tracking-widest block mb-2">Visitante</span>
                        <div class="text-2xl font-bold {currentMatchups[state.currentMatchupIndex].teamB ? 'text-white' : 'text-gray-600'}">
                            {currentMatchups[state.currentMatchupIndex].teamB?.name || "???"}
                        </div>
                    </div>
                </div>

                <div class="mb-8">
                    <h3 class="text-sm font-bold text-gray-400 uppercase mb-4">Equipos en el bombo:</h3>
                    <div class="flex flex-wrap gap-3">
                        {#each availableForDraw as team}
                            <button
                                onclick={() => pickNextMatchup(team.id)}
                                disabled={state.revealingTeam !== null || !!(currentMatchups[state.currentMatchupIndex].teamA && currentMatchups[state.currentMatchupIndex].teamB)}
                                class="flex items-center gap-3 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded transition-all active:scale-95 disabled:opacity-30"
                            >
                                <img src={team.image} alt="" class="w-6 h-6 object-contain" />
                                <span class="font-semibold text-sm">{team.name}</span>
                            </button>
                        {/each}
                    </div>
                </div>

                <div class="flex justify-between items-center bg-white/5 p-4 rounded-lg">
                    <div class="text-sm text-gray-400">
                        Paso {state.currentMatchupIndex + 1} de {currentMatchups.length}
                    </div>
                    <button
                        onclick={advanceMatchup}
                        disabled={!currentMatchups[state.currentMatchupIndex].teamA || !currentMatchups[state.currentMatchupIndex].teamB || state.currentMatchupIndex >= currentMatchups.length - 1}
                        class="px-6 py-2 bg-green-600 hover:bg-green-500 disabled:opacity-50 rounded font-bold transition-all"
                    >
                        Siguiente Paso
                    </button>
                </div>
            </div>
        {/if}
    </div>
</div>

