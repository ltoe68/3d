export interface MusicTrack {
  id: string;
  name: string;
  url: string;
  volume: number;
  loop: boolean;
}

export interface DialogueLine {
  id: string;
  text: string;
  speaker?: string;
  audioUrl?: string;
  duration?: number; // In secondi
  delay?: number; // Ritardo prima di riprodurre
}

export interface AudioConfig {
  music: {
    enabled: boolean;
    tracks: MusicTrack[];
    currentTrackIndex: number;
    masterVolume: number;
  };
  dialogues: {
    enabled: boolean;
    lines: DialogueLine[];
    autoPlay: boolean;
    voiceSettings?: {
      pitch: number; // 0.5 - 2.0
      rate: number; // 0.1 - 10
      volume: number; // 0 - 1
      voice?: string; // Nome della voce TTS
    };
  };
  spatialAudio: {
    enabled: boolean;
    listenerPosition: [number, number, number];
  };
}

export const defaultAudioConfig: AudioConfig = {
  music: {
    enabled: false,
    tracks: [],
    currentTrackIndex: 0,
    masterVolume: 0.5
  },
  dialogues: {
    enabled: false,
    lines: [],
    autoPlay: false,
    voiceSettings: {
      pitch: 1,
      rate: 1,
      volume: 1,
      voice: undefined
    }
  },
  spatialAudio: {
    enabled: false,
    listenerPosition: [0, 0, 0]
  }
};

// Preset di musica
export const musicPresets: { [key: string]: MusicTrack[] } = {
  cinematico: [
    {
      id: 'cinematic-1',
      name: 'Epic Orchestral',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      volume: 0.6,
      loop: true
    }
  ],
  rilassante: [
    {
      id: 'ambient-1',
      name: 'Ambient Space',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      volume: 0.4,
      loop: true
    }
  ],
  elettronico: [
    {
      id: 'electronic-1',
      name: 'Synthwave',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
      volume: 0.5,
      loop: true
    }
  ]
};

// Dialoghi di esempio per i personaggi vitigni
export const dialoguePresets: { [key: string]: DialogueLine[] } = {
  vitigni: [
    {
      id: 'merlot-1',
      text: 'Insieme siamo più forti! Uniamoci per salvare le Terre dei Vitigni.',
      speaker: 'Merlot',
      duration: 4
    },
    {
      id: 'pinot-1',
      text: 'La bellezza è nella fragilità... Ogni terroir racconta una storia unica.',
      speaker: 'Pinot Noir',
      duration: 5,
      delay: 5
    },
    {
      id: 'chardonnay-1',
      text: "L'arte è nell'evoluzione. Posso trasformare ogni elemento in qualcosa di prezioso.",
      speaker: 'Chardonnay',
      duration: 5,
      delay: 11
    },
    {
      id: 'sauvignon-1',
      text: 'La vita è un\'avventura! Non posso stare ferma in un posto.',
      speaker: 'Sauvignon Blanc',
      duration: 4,
      delay: 17
    }
  ],
  motivazionale: [
    {
      id: 'welcome',
      text: 'Benvenuto nel mondo 3D! Esplora e personalizza la tua scena.',
      duration: 4
    },
    {
      id: 'tip-1',
      text: 'Usa il mouse per ruotare la vista. Scroll per ingrandire.',
      duration: 4,
      delay: 5
    },
    {
      id: 'tip-2',
      text: 'Prova i preset nel pannello di configurazione per illuminazioni diverse.',
      duration: 5,
      delay: 10
    }
  ]
};
