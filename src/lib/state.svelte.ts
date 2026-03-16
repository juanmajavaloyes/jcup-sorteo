// Svelte 5 state management and channel syncing
import { browser } from '$app/environment';

export type ScreenState = 'intro' | 'presentation' | 'video' | 'draw' | 'bracket';
export type TournamentType = 'jcup' | 'sierracup';

export interface Player {
    name: string;
    number: string | number;
}

export interface Team {
    id: string;
    name: string;
    image: string;
    players: Player[];
    tournament: TournamentType;
}

export interface Matchup {
    id: string;
    label: string;
    teamA: Team | null;
    teamB: Team | null;
}

export interface AppState {
    currentScreen: ScreenState;
    selectedTournament: TournamentType;
    availableTeams: Team[];
    // Separate matchups for each tournament
    jcupMatchups: Matchup[];
    sierracupMatchups: Matchup[];
    currentMatchupIndex: number; 
    revealingTeam: 'A' | 'B' | null;
    presentingTeamId: string | null;
    isMusicPlaying: boolean;
    musicVolume: number;
}

const teamsList: Team[] = [
    {
        id: '1a', name: '1º ESO A', image: '/1A.png', tournament: 'jcup', players: [
            { name: 'Thobías Aponte', number: 37 }, { name: 'Cristian Caluse', number: 67 },
            { name: 'René Centellas', number: 19 }, { name: 'Juan Collado', number: 21 },
            { name: 'Darío de la Fuente', number: 7 }, { name: 'Luca Dopico', number: 2 },
            { name: 'Miguel García', number: 3 }, { name: 'Daniel García', number: 12 },
            { name: 'Ander González', number: 5 }, { name: 'Ángel Luis Hernández', number: 6 },
            { name: 'Guillermo Jiménez', number: 10 }, { name: 'Víctor Martín', number: 14 },
            { name: 'Eloy Martín', number: 11 }, { name: 'Joel Miranda', number: 8 },
            { name: 'Ángel Moratiel', number: 20 }, { name: 'Adrián Moreta', number: 4 },
            { name: 'Nicolás Naranjo', number: 17 }, { name: 'Ismael Niebla', number: 1 },
            { name: 'Eizan Poliwani', number: 18 }, { name: 'Xavier Silva', number: 15 },
            { name: 'Ismael Suárez', number: 27 }, { name: 'Cristóbal Táuler', number: 77 }
        ]
    },
    {
        id: '1b', name: '1º ESO B', image: '/1B.png', tournament: 'jcup', players: [
            { name: 'Henry Ahman', number: 2 }, { name: 'Piki Alcázar', number: 8 },
            { name: 'Thiago Crispín', number: 19 }, { name: 'Alberto Gabasa', number: 20 },
            { name: 'Izan García', number: 12 }, { name: 'Marco García', number: 14 },
            { name: 'Matías García', number: 67 }, { name: 'Rubén González', number: 4 },
            { name: 'Álvaro Gonzalo', number: 33 }, { name: 'Peichen Li', number: 23 },
            { name: 'Mathías Lozano', number: 6 }, { name: 'Máximo Manzanero', number: 13 },
            { name: 'Thomas Mateus', number: 1 }, { name: 'Esteban Mendieta', number: 99 },
            { name: 'Elías Mercado', number: 9 }, { name: 'Alejandro Miguel', number: 11 },
            { name: 'Oswaldo Oria', number: 0 }, { name: 'José María Polo', number: 18 },
            { name: 'Mauro Pradas', number: 10 }, { name: 'Ademir Quinto', number: 22 },
            { name: 'Alejandro Rey', number: 3 }, { name: 'Santiago Rodríguez', number: 5 },
            { name: 'Isaac Ureña', number: 15 }, { name: 'Justin Yugcha', number: 66 },
            { name: 'Adrián Zegarra', number: 21 }
        ]
    },
    {
        id: '2a', name: '2º ESO A', image: '/2A.png', tournament: 'jcup', players: [
            { name: 'Carlos Agudo', number: 3 }, { name: 'Iker Aguirre', number: 20 },
            { name: 'Alonso Alcalá', number: 6 }, { name: 'Kevin Andrango', number: 1 },
            { name: 'Eliceo Benalcázar', number: 30 }, { name: 'Bryan Calderón', number: 15 },
            { name: 'Samuel Gabarre', number: 19 }, { name: 'Santiago García', number: 11 },
            { name: 'Juan González', number: 10 }, { name: 'Javier Jiménez', number: 12 },
            { name: 'Rodrigo López', number: 14 }, { name: 'Daniel Lorenzo', number: 17 },
            { name: 'Alonso Maniega', number: 4 }, { name: 'David Muro', number: 50 },
            { name: 'Gonzalo Naranjo', number: 9 }, { name: 'Leonel Nina', number: 36 },
            { name: 'Michael Peña', number: 52 }, { name: 'David Pérez', number: 99 },
            { name: 'Damián Rojas', number: 21 }, { name: 'Iker Román', number: 7 },
            { name: 'Marvin Toledo', number: 5 }, { name: 'Dylan Vásquez', number: 95 },
            { name: 'Felipe Vásquez', number: 8 }, { name: 'Augusto Velazco', number: 24 },
            { name: 'Jose María Zayas', number: 45 }
        ]
    },
    {
        id: '2b', name: '2º ESO B', image: '/2B.png', tournament: 'jcup', players: [
            { name: 'Jasón Álvarez', number: 6 }, { name: 'Izan Basurto', number: 3 },
            { name: 'Daniel G. Barriuso', number: 31 }, { name: 'Izan García', number: 1 },
            { name: 'Guillermo García', number: 10 }, { name: 'Juan Pablo Guédez', number: 8 },
            { name: 'Eric Hernández', number: 32 }, { name: 'Alejandro Losana', number: 9 },
            { name: 'Sergio Luque', number: 19 }, { name: 'Samuel Medrano', number: 20 },
            { name: 'Matías Montaño', number: 22 }, { name: 'Hugo Oraa', number: 3 },
            { name: 'Ángel Prada', number: 30 }, { name: 'Hugo Rodríguez', number: 33 },
            { name: 'Aitor Sánchez', number: 11 }, { name: 'Francisco Serrano', number: 99 },
            { name: 'Marcus Phol Vargas', number: 28 }, { name: 'Carlos Zurita', number: 18 }
        ]
    },
    {
        id: '1c', name: '1º ESO C', image: '/1C.png', tournament: 'sierracup', players: [
            { name: 'Unai Alarcón', number: 7 }, { name: 'Pedro Beltrán', number: 10 },
            { name: 'Raúl Bernardo', number: 16 }, { name: 'Joaquín Campos', number: 31 },
            { name: 'Bryan Canela', number: 21 }, { name: 'Evans Cruz', number: 8 },
            { name: 'Héctor Díaz', number: 1 }, { name: 'Óliver García', number: 99 },
            { name: 'José Daniel Grisales', number: 33 }, { name: 'Anthony Gutiérrez', number: 11 },
            { name: 'Paulo Henriques', number: 67 }, { name: 'Derek J. Iglesias', number: 17 },
            { name: 'Benjamin Laínez', number: 23 }, { name: 'Luke Leyva', number: 20 },
            { name: 'Daniel Mamani', number: 12 }, { name: 'Ariel Ojeda', number: 5 },
            { name: 'Eric Olteanu', number: 3 }, { name: 'Valentino Pacurar', number: 2 },
            { name: 'Adrián Parrilla', number: 24 }, { name: 'Mateo Ruiz', number: 28 },
            { name: 'Alejandro Sánchez', number: 9 }, { name: 'Daniel Sarmiento', number: 19 },
            { name: 'Alejandro Vadillo', number: 41 }, { name: 'Alonso Vázquez', number: 13 }
        ]
    },
    {
        id: '1d', name: '1º ESO D', image: '/1D.png', tournament: 'sierracup', players: [
            { name: 'Pablo Alcalá', number: 6 }, { name: 'Guillermo Antúnez', number: 4 },
            { name: 'Miquel Arango', number: 23 }, { name: 'Derek Carvajal', number: 11 },
            { name: 'Pepe Carvallo', number: 17 }, { name: 'Jorge Cuadrado', number: 3 },
            { name: 'Álvaro Daimiel', number: 7 }, { name: 'Marco Durán', number: 11 },
            { name: 'Santiago El Rezz', number: 93 }, { name: 'Miguel Fernández', number: 99 },
            { name: 'Adrián Flores', number: 8 }, { name: 'Alejandro García', number: 12 },
            { name: 'Javier González', number: 20 }, { name: 'Mario González', number: 10 },
            { name: 'Miguel Ángel Guevara', number: 98 }, { name: 'Guangyu Huang', number: 45 },
            { name: 'Daniel Infante', number: 1 }, { name: 'Hugo Monrreal', number: 5 },
            { name: 'Cristian Moreno', number: 18 }, { name: 'Álvaro Ojeda', number: 67 },
            { name: 'Joel Pérez', number: 0 }, { name: 'Lucas Redondo', number: 19 },
            { name: 'Álvaro Rogero', number: 2 }, { name: 'Denis Sanz', number: 13 },
            { name: 'Nicolás Zapata', number: 9 }, { name: 'Guzmán Zorzo', number: 14 }
        ]
    },
    {
        id: '1e', name: '1º ESO E', image: '/1E.png', tournament: 'sierracup', players: [
            { name: 'Javier Almela', number: 0 }, { name: 'Santiago Alonso', number: 99 },
            { name: 'Álvaro Antúnez', number: 33 }, { name: 'Pablo Baz', number: 8 },
            { name: 'Pablo Bello', number: 95 }, { name: 'Alejandro de la Calle', number: 7 },
            { name: 'Aitor de la Torre', number: 17 }, { name: 'Izan de las Heras', number: 2 },
            { name: 'Diego de Pablo', number: 19 }, { name: 'Carlos Giménez', number: 9 },
            { name: 'Adrián Gómez', number: 15 }, { name: 'Francesco Guedez', number: 11 },
            { name: 'Emilio Julca', number: 73 }, { name: 'Enrique Larrocha', number: 24 },
            { name: 'Carlos Marín', number: 23 }, { name: 'Alexander Martínez', number: 77 },
            { name: 'Antonio Morán', number: 55 }, { name: 'Ian Pérez', number: 20 },
            { name: 'Darío Pérez-Cea', number: 10 }, { name: 'Carlos Ponce', number: 25 },
            { name: 'Diego Ramos', number: 6 }, { name: 'Gonzalo Ron', number: 18 },
            { name: 'Adrián Saquinga', number: 21 }, { name: 'Andrés Táuler', number: 1 },
            { name: 'Aleix Téllez', number: 12 }, { name: 'Thiago Torres', number: 13 },
            { name: 'Henry Torres', number: 67 }
        ]
    },
    {
        id: '2d', name: '2º ESO D', image: '/2D.png', tournament: 'sierracup', players: [
            { name: 'Gerard Arévalo', number: 24 }, { name: 'Guillermo Arjonilla', number: 25 },
            { name: 'Alexander Arroyo', number: 11 }, { name: 'Bruno Benito', number: 81 },
            { name: 'Juanes Betancourt', number: 5 }, { name: 'Luca Campoy', number: 47 },
            { name: 'Rubén Carracedo', number: 8 }, { name: 'Hongfei Chen', number: 68 },
            { name: 'Francisco del Reino', number: 19 }, { name: 'Fabrizio Fernández', number: 4 },
            { name: 'Alejandro Jaramillo', number: 20 }, { name: 'Ian Machado', number: 27 },
            { name: 'Eze Maldonado', number: 10 }, { name: 'Pablo Martínez', number: 6 },
            { name: 'Adrián Medina', number: 16 }, { name: 'Nuoxi Ni', number: 15 },
            { name: 'Asier Osorio', number: 9 }, { name: 'Brais Romero', number: 12 },
            { name: 'Óliver Santos', number: 1 }, { name: 'Joaquín Zegarra', number: 23 }
        ]
    },
    {
        id: '2e', name: '2º ESO E', image: '/2E.png', tournament: 'sierracup', players: [
            { name: 'Raúl Álvarez', number: 78 }, { name: 'Santiago Andrade', number: 8 },
            { name: 'Álvaro Blázquez', number: 4 }, { name: 'Pablo Cerro', number: 1 },
            { name: 'André B. Chinchón', number: 2 }, { name: 'Adriá Clols', number: 54 },
            { name: 'Gabriel Cobos', number: 7 }, { name: 'Thiago Cruz', number: 22 },
            { name: 'Daniel Gallego', number: 5 }, { name: 'Mathias Gaona', number: 13 },
            { name: 'Mateo García-Ramos', number: 3 }, { name: 'Fabián González', number: 9 },
            { name: 'Luis Gordillo', number: 20 }, { name: 'Matías Imaicela', number: 8 },
            { name: 'Alexander Jalca', number: 15 }, { name: 'Aitor Oneglio', number: 6 },
            { name: 'Jacob Otamendi', number: 33 }, { name: 'Gonzalo Pablos', number: 24 },
            { name: 'Rommel Romario Rivas', number: 44 }, { name: 'Francisco Rodríguez', number: 47 },
            { name: 'Gonzalo Sáez', number: 77 }, { name: 'Raúl Sánchez', number: 17 }
        ]
    }
];

// Initial State
const initialState: AppState = {
    currentScreen: 'intro',
    selectedTournament: 'jcup',
    availableTeams: [...teamsList],
    jcupMatchups: [
        { id: 'j1', label: 'Semifinal 1', teamA: null, teamB: null },
        { id: 'j2', label: 'Semifinal 2', teamA: null, teamB: null }
    ],
    sierracupMatchups: [
        { id: 's1', label: 'Play-in', teamA: null, teamB: null },
        { id: 's2', label: 'Semifinal 1', teamA: null, teamB: null },
        { id: 's3', label: 'Semifinal 2', teamA: null, teamB: null }
    ],
    currentMatchupIndex: 0,
    revealingTeam: null,
    presentingTeamId: null,
    isMusicPlaying: false,
    musicVolume: 0.5
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
        globalState.selectedTournament = newState.selectedTournament;
        globalState.availableTeams = newState.availableTeams;
        globalState.jcupMatchups = newState.jcupMatchups;
        globalState.sierracupMatchups = newState.sierracupMatchups;
        globalState.currentMatchupIndex = newState.currentMatchupIndex;
        globalState.revealingTeam = newState.revealingTeam;
        globalState.presentingTeamId = newState.presentingTeamId;
        globalState.isMusicPlaying = newState.isMusicPlaying;
        globalState.musicVolume = newState.musicVolume;
    };
}

export function getState() {
    return globalState;
}

export function updateState(updater: (state: AppState) => void) {
    updater(globalState);
    if (browser && channel) {
        channel.postMessage($state.snapshot(globalState));
    }
}

