// Svelte 5 state management and channel syncing
import { browser } from '$app/environment';

export type ScreenState = 'intro' | 'presentation' | 'draw' | 'bracket';

export interface Team {
    id: string;
    name: string;
    image: string;
    players: string[];
}

export interface Matchup {
    teamA: Team | null;
    teamB: Team | null;
}

export interface AppState {
    currentScreen: ScreenState;
    availableTeams: Team[];
    matchups: Matchup[];     // 4 pairings for 8 teams
    currentMatchupIndex: number; // 0 to 3
    revealingTeam: 'A' | 'B' | null; // Which team in the current pairing is being revealed
    presentingTeamId: string | null;
}

const generatePlayers = (prefix: string) => Array.from({ length: 10 }, (_, i) => `Jugador ${prefix} ${i + 1}`);

const teamsList: Team[] = [
    { id: '1', name: '1º ESO A', image: '/escudo1-1.png', players: generatePlayers('A') },
    { id: '2', name: '1º ESO B', image: '/escudo2-1B.png', players: generatePlayers('B') },
    { id: '3', name: '1º ESO C', image: '/escudo3-1C.png', players: generatePlayers('C') },
    { id: '4', name: '1º ESO D', image: '/escudo4-1D.png', players: generatePlayers('D') },
    { id: '5', name: '1º ESO E', image: '/escudo5-1E.png', players: generatePlayers('E') },
    { id: '6', name: '2º ESO A', image: '/escudo6-2A.png', players: generatePlayers('F') },
    { id: '7', name: '2º ESO B', image: '/escudo7-2B.png', players: generatePlayers('G') },
    { id: '8', name: '2º ESO D', image: '/escudo8-2D.png', players: generatePlayers('H') }
];

// Initial State
const initialState: AppState = {
    currentScreen: 'intro',
    availableTeams: [...teamsList],
    matchups: [
        { teamA: null, teamB: null },
        { teamA: null, teamB: null },
        { teamA: null, teamB: null },
        { teamA: null, teamB: null }
    ],
    currentMatchupIndex: 0,
    revealingTeam: null,
    presentingTeamId: null
};

// Singleton state
let globalState = $state<AppState>(structuredClone(initialState));

// Setup BroadcastChannel for cross-tab sync
let channel: BroadcastChannel | null = null;

if (browser) {
    channel = new BroadcastChannel('champions-draw-sync');

    channel.onmessage = (event) => {
        const newState = event.data as AppState;

        globalState.currentScreen = newState.currentScreen;
        globalState.availableTeams = newState.availableTeams;
        globalState.matchups = newState.matchups;
        globalState.currentMatchupIndex = newState.currentMatchupIndex;
        globalState.revealingTeam = newState.revealingTeam;
        globalState.presentingTeamId = newState.presentingTeamId;
    };
}

export function getState() {
    return globalState;
}

export function updateState(updater: (state: AppState) => void) {
    updater(globalState);
    if (browser && channel) {
        // Broadcast the full new state
        // structuredClone is used to remove Svelte proxies before sending
        channel.postMessage($state.snapshot(globalState));
    }
}
