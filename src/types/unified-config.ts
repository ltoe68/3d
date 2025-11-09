import type { SceneConfig } from './scene-config';
import type { AudioConfig } from './audio-config';
import { defaultSceneConfig } from './scene-config';
import { defaultAudioConfig } from './audio-config';

export interface UnifiedConfig {
  scene: SceneConfig;
  audio: AudioConfig;
}

export const defaultUnifiedConfig: UnifiedConfig = {
  scene: defaultSceneConfig,
  audio: defaultAudioConfig
};

// Preset unificati con scene + audio
export const unifiedPresets: { [key: string]: UnifiedConfig } = {
  cinematico: {
    scene: {
      lights: [
        { type: 'ambient', intensity: 0.2, color: '#1a1a2e' },
        { type: 'directional', intensity: 2, position: [5, 10, 5], color: '#ff6b6b' },
        { type: 'point', intensity: 1.5, position: [-5, 5, -5], color: '#4ecdc4' }
      ],
      material: { metalness: 0.9, roughness: 0.1 },
      transform: {
        rotation: [-Math.PI / 4, 0, 0],
        scale: [1, 1, 1],
        position: [0, 0, 0]
      },
      animation: {
        enabled: true,
        rotationSpeed: [0, 0.005, 0],
        bounceAmplitude: 0,
        bounceSpeed: 1
      },
      background: '#0f0f1e'
    },
    audio: {
      music: {
        enabled: true,
        tracks: [
          {
            id: 'cinematic-1',
            name: 'Epic Orchestral',
            url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
            volume: 0.6,
            loop: true
          }
        ],
        currentTrackIndex: 0,
        masterVolume: 0.5
      },
      dialogues: {
        enabled: false,
        lines: [],
        autoPlay: false,
        voiceSettings: {
          pitch: 0.9,
          rate: 0.9,
          volume: 1,
          voice: undefined
        }
      },
      spatialAudio: {
        enabled: false,
        listenerPosition: [0, 0, 0]
      }
    }
  },
  vitigni: {
    scene: {
      lights: [
        { type: 'ambient', intensity: 0.5, color: '#ffeaa7' },
        { type: 'directional', intensity: 1.2, position: [10, 15, 10], color: '#fdcb6e' }
      ],
      material: { metalness: 0.4, roughness: 0.6, color: '#8B4789' },
      transform: {
        rotation: [-Math.PI / 6, Math.PI / 4, 0],
        scale: [1.2, 1.2, 1.2],
        position: [0, 0, 0]
      },
      animation: {
        enabled: true,
        rotationSpeed: [0, 0.01, 0],
        bounceAmplitude: 0.2,
        bounceSpeed: 1.5
      },
      background: '#2d1b2e'
    },
    audio: {
      music: {
        enabled: true,
        tracks: [
          {
            id: 'ambient-1',
            name: 'Ambient Wine',
            url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
            volume: 0.4,
            loop: true
          }
        ],
        currentTrackIndex: 0,
        masterVolume: 0.4
      },
      dialogues: {
        enabled: true,
        lines: [
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
          }
        ],
        autoPlay: true,
        voiceSettings: {
          pitch: 1.1,
          rate: 0.95,
          volume: 1,
          voice: undefined
        }
      },
      spatialAudio: {
        enabled: false,
        listenerPosition: [0, 0, 5]
      }
    }
  },
  naturale: {
    scene: {
      lights: [
        { type: 'ambient', intensity: 0.6, color: '#ffeaa7' },
        { type: 'directional', intensity: 1.2, position: [10, 15, 10], color: '#fdcb6e' }
      ],
      material: { metalness: 0.2, roughness: 0.8 },
      transform: {
        rotation: [-Math.PI / 4, 0, 0],
        scale: [1, 1, 1],
        position: [0, 0, 0]
      },
      animation: {
        enabled: true,
        rotationSpeed: [0, 0.003, 0],
        bounceAmplitude: 0.1,
        bounceSpeed: 0.8
      },
      background: '#74b9ff'
    },
    audio: {
      music: {
        enabled: true,
        tracks: [
          {
            id: 'nature-1',
            name: 'Nature Sounds',
            url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
            volume: 0.5,
            loop: true
          }
        ],
        currentTrackIndex: 0,
        masterVolume: 0.5
      },
      dialogues: {
        enabled: true,
        lines: [
          {
            id: 'welcome',
            text: 'Benvenuto nel mondo 3D! Esplora e personalizza la tua scena.',
            duration: 4
          }
        ],
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
    }
  }
};
