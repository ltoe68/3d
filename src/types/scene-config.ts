export interface LightConfig {
  type: 'ambient' | 'directional' | 'point' | 'spot';
  intensity: number;
  position?: [number, number, number];
  color?: string;
}

export interface MaterialConfig {
  metalness: number;
  roughness: number;
  color?: string;
  emissive?: string;
  emissiveIntensity?: number;
}

export interface TransformConfig {
  rotation: [number, number, number];
  scale: [number, number, number];
  position: [number, number, number];
}

export interface AnimationConfig {
  enabled: boolean;
  rotationSpeed: [number, number, number];
  bounceAmplitude: number;
  bounceSpeed: number;
}

export interface SceneConfig {
  lights: LightConfig[];
  material: MaterialConfig;
  transform: TransformConfig;
  animation: AnimationConfig;
  background: string;
}

export const defaultSceneConfig: SceneConfig = {
  lights: [
    {
      type: 'ambient',
      intensity: 0.5,
      color: '#ffffff'
    },
    {
      type: 'directional',
      intensity: 1,
      position: [10, 10, 5],
      color: '#ffffff'
    },
    {
      type: 'point',
      intensity: 0.5,
      position: [-10, -10, -5],
      color: '#4488ff'
    }
  ],
  material: {
    metalness: 0.3,
    roughness: 0.7,
    color: '#ffffff'
  },
  transform: {
    rotation: [-Math.PI / 4, 0, 0],
    scale: [1, 1, 1],
    position: [0, 0, 0]
  },
  animation: {
    enabled: true,
    rotationSpeed: [0, 0.01, 0],
    bounceAmplitude: 0,
    bounceSpeed: 1
  },
  background: '#000000'
};
