<script lang="ts">
    import { getState, updateState, type Team } from "$lib/state.svelte";

    const state = getState();

    function setScreen(screen: "intro" | "presentation" | "draw" | "bracket") {
        updateState((s) => {
            s.currentScreen = screen;
        });
    }

    // Teams that haven't been picked yet
    let availableForDraw = $derived(
        state.availableTeams.filter(
            (t) =>
                !state.matchups.some(
                    (m) => m.teamA?.id === t.id || m.teamB?.id === t.id,
                ),
        ),
    );

    function pickNextMatchup(teamId: string) {
        const team = state.availableTeams.find((t) => t.id === teamId);
        if (!team) return;

        updateState((s) => {
            const current = s.matchups[s.currentMatchupIndex];

            if (!current.teamA) {
                // Pick team A
                current.teamA = team;
                s.revealingTeam = "A";

                // simulate reveal spinner and then clear revealing state
                setTimeout(() => {
                    updateState((s2) => {
                        s2.revealingTeam = null;
                    });
                }, 2000);
            } else if (!current.teamB) {
                // Pick team B
                current.teamB = team;
                s.revealingTeam = "B";

                setTimeout(() => {
                    updateState((s2) => {
                        s2.revealingTeam = null;
                    });
                }, 2000);
            }
        });
    }

    function advanceMatchup() {
        updateState((s) => {
            if (
                s.currentMatchupIndex < 3 &&
                s.matchups[s.currentMatchupIndex].teamA &&
                s.matchups[s.currentMatchupIndex].teamB
            ) {
                s.currentMatchupIndex++;
                s.revealingTeam = null;
            }
        });
    }

    function resetDraw() {
        updateState((s) => {
            s.currentScreen = "intro";
            s.currentMatchupIndex = 0;
            s.revealingTeam = null;
            s.matchups = [
                { teamA: null, teamB: null },
                { teamA: null, teamB: null },
                { teamA: null, teamB: null },
                { teamA: null, teamB: null },
            ];
        });
    }
</script>

<div class="min-h-screen h-screen overflow-y-auto bg-gray-900 text-white p-8">
    <div class="max-w-4xl mx-auto flex flex-col gap-8 pb-16">
        <div class="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h1 class="text-3xl font-bold mb-2">Panel de Control: Director</h1>
            <p class="text-gray-400">
                Controla lo que se ve en la pantalla principal.
            </p>

            <button
                onclick={resetDraw}
                class="mt-4 px-4 py-2 bg-red-600 hover:bg-red-500 rounded text-sm font-semibold"
            >
                Resetear todo el sorteo
            </button>
        </div>

        <div class="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h2 class="text-xl font-bold mb-4">Paso 1: Control de Escena</h2>
            <div class="grid grid-cols-4 gap-4">
                <button
                    onclick={() => setScreen("intro")}
                    class="px-4 py-3 rounded font-bold transition-colors {state.currentScreen ===
                    'intro'
                        ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                        : 'bg-gray-700 hover:bg-gray-600'}"
                >
                    Intro (Vídeo)
                </button>
                <button
                    onclick={() => setScreen("presentation")}
                    class="px-4 py-3 rounded font-bold transition-colors {state.currentScreen ===
                    'presentation'
                        ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                        : 'bg-gray-700 hover:bg-gray-600'}"
                >
                    1. Presentación
                </button>
                <button
                    onclick={() => setScreen("draw")}
                    class="px-4 py-3 rounded font-bold transition-colors {state.currentScreen ===
                    'draw'
                        ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                        : 'bg-gray-700 hover:bg-gray-600'}"
                >
                    2. Sorteo Activo
                </button>
                <button
                    onclick={() => setScreen("bracket")}
                    class="px-4 py-3 rounded font-bold transition-colors {state.currentScreen ===
                    'bracket'
                        ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                        : 'bg-gray-700 hover:bg-gray-600'}"
                >
                    3. Ver Cuadro Final
                </button>
            </div>
        </div>

        {#if state.currentScreen === "presentation"}
            <div
                class="bg-indigo-900 border border-indigo-600 p-6 rounded-xl mt-4"
            >
                <h2 class="text-xl font-bold mb-4">
                    Presentación de Jugadores
                </h2>
                <p class="text-indigo-300 mb-6">
                    Haz clic en un equipo para mostrar la plantilla en pantalla.
                    Aparecerá a la izquierda mientras se listan sus jugadores.
                    Pincha en "Cerrar" para devolver la pantalla principal a la
                    vista de todos los escudos.
                </p>
                <div class="flex flex-wrap gap-4">
                    {#each state.availableTeams as team}
                        <button
                            onclick={() =>
                                updateState((s) => {
                                    s.presentingTeamId = team.id;
                                })}
                            class="flex flex-col items-center gap-2 p-3 bg-indigo-800 hover:bg-indigo-700 rounded-lg border transition-all {state.presentingTeamId ===
                            team.id
                                ? 'border-white ring-4 ring-indigo-400 bg-indigo-600 scale-105'
                                : 'border-indigo-500'}"
                        >
                            <img
                                src={team.image}
                                alt=""
                                class="w-16 h-16 object-contain"
                            />
                            <span class="text-xs font-bold uppercase"
                                >{team.name}</span
                            >
                        </button>
                    {/each}
                </div>

                <div class="mt-8 flex justify-end">
                    <button
                        onclick={() =>
                            updateState((s) => {
                                s.presentingTeamId = null;
                            })}
                        disabled={!state.presentingTeamId}
                        class="px-6 py-3 bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:bg-gray-700 rounded font-bold shadow-lg"
                    >
                        Cerrar Presentación Actual
                    </button>
                </div>
            </div>
        {/if}

        {#if state.currentScreen === "draw"}
            <div
                class="bg-blue-900 border border-blue-600 p-6 rounded-xl relative overflow-hidden"
            >
                <div class="relative z-10">
                    <h2 class="text-xl font-bold mb-2">
                        Sorteo en Directo: Emparejamiento {state.currentMatchupIndex +
                            1}
                    </h2>
                    <p class="text-blue-300 mb-6">
                        Selecciona los equipos según van saliendo en el sorteo
                        real.
                    </p>

                    <div
                        class="flex gap-8 mb-8 items-center bg-black/40 p-4 rounded-lg"
                    >
                        <div class="flex-1 text-center">
                            <span
                                class="text-xs text-gray-400 uppercase tracking-widest block mb-1"
                                >Local</span
                            >
                            <div
                                class="text-2xl font-bold {state.matchups[
                                    state.currentMatchupIndex
                                ].teamA
                                    ? 'text-white'
                                    : 'text-gray-500'}"
                            >
                                {state.matchups[state.currentMatchupIndex].teamA
                                    ?.name || "Esperando rival 1..."}
                            </div>
                        </div>
                        <div class="text-3xl font-black text-gray-600">VS</div>
                        <div class="flex-1 text-center">
                            <span
                                class="text-xs text-gray-400 uppercase tracking-widest block mb-1"
                                >Visitante</span
                            >
                            <div
                                class="text-2xl font-bold {state.matchups[
                                    state.currentMatchupIndex
                                ].teamB
                                    ? 'text-white'
                                    : 'text-gray-500'}"
                            >
                                {state.matchups[state.currentMatchupIndex].teamB
                                    ?.name || "Esperando rival 2..."}
                            </div>
                        </div>
                    </div>

                    <h3 class="font-semibold mb-3">Equipos en el bombo:</h3>
                    <div class="flex flex-wrap gap-3">
                        {#each availableForDraw as team}
                            <button
                                onclick={() => pickNextMatchup(team.id)}
                                disabled={state.revealingTeam !== null ||
                                    (state.matchups[state.currentMatchupIndex]
                                        .teamA !== null &&
                                        state.matchups[
                                            state.currentMatchupIndex
                                        ].teamB !== null)}
                                class="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded"
                            >
                                <img
                                    src={team.image}
                                    alt=""
                                    class="w-6 h-6 object-contain"
                                />
                                <span>{team.name}</span>
                            </button>
                        {/each}
                    </div>

                    <div class="mt-8 flex justify-end">
                        <button
                            onclick={advanceMatchup}
                            disabled={!state.matchups[state.currentMatchupIndex]
                                .teamA ||
                                !state.matchups[state.currentMatchupIndex]
                                    .teamB ||
                                state.currentMatchupIndex >= 3}
                            class="px-6 py-3 bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:bg-gray-700 rounded font-bold shadow-lg"
                        >
                            Siguiente Emparejamiento
                        </button>
                    </div>
                </div>
            </div>
        {/if}
    </div>
</div>
