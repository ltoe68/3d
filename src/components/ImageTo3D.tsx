import { useState, useRef, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Upload, RotateCcw } from 'lucide-react';
import { SceneConfigEditor } from './SceneConfigEditor';
import type { SceneConfig } from '@/types/scene-config';
import { defaultSceneConfig } from '@/types/scene-config';
import * as THREE from 'three';

interface ImageTo3DProps {
  className?: string;
}

export const ImageTo3D = ({ className }: ImageTo3DProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [depth, setDepth] = useState([30]);
  const [resolution, setResolution] = useState([50]);
  const [sceneConfig, setSceneConfig] = useState<SceneConfig>(defaultSceneConfig);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      setImageUrl(url);

      // Crea un'immagine per estrarre i dati dei pixel
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxSize = resolution[0];
        const scale = Math.min(maxSize / img.width, maxSize / img.height);

        canvas.width = Math.floor(img.width * scale);
        canvas.height = Math.floor(img.height * scale);

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
          setImageData(data);
        }
      };
      img.src = url;
    };
    reader.readAsDataURL(file);
  }, [resolution]);

  const handleReset = () => {
    setImageUrl(null);
    setImageData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle>Immagine to 3D Converter</CardTitle>
          <CardDescription>
            Carica un'immagine e trasformala in un modello 3D basato sulla luminosità
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Upload Section */}
            <div className="flex gap-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Carica Immagine
              </Button>
              {imageUrl && (
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </Button>
              )}
            </div>

            {/* Controls */}
            {imageUrl && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Profondità 3D: {depth[0]}</Label>
                  <Slider
                    value={depth}
                    onValueChange={setDepth}
                    min={10}
                    max={100}
                    step={5}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Risoluzione: {resolution[0]}x{resolution[0]}</Label>
                  <Slider
                    value={resolution}
                    onValueChange={setResolution}
                    min={20}
                    max={100}
                    step={10}
                  />
                </div>
              </div>
            )}

            {/* Preview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Original Image */}
              {imageUrl && (
                <div className="space-y-2">
                  <Label>Immagine Originale</Label>
                  <div className="border rounded-lg overflow-hidden bg-muted">
                    <img
                      src={imageUrl}
                      alt="Uploaded"
                      className="w-full h-64 object-contain"
                    />
                  </div>
                </div>
              )}

              {/* 3D View */}
              {imageData && (
                <div className="space-y-2">
                  <Label>Vista 3D</Label>
                  <div className="border rounded-lg overflow-hidden h-64" style={{ background: sceneConfig.background }}>
                    <Canvas>
                      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
                      <OrbitControls enableDamping />

                      {/* Luci configurabili */}
                      {sceneConfig.lights.map((light, index) => {
                        if (light.type === 'ambient') {
                          return <ambientLight key={index} intensity={light.intensity} color={light.color} />;
                        } else if (light.type === 'directional') {
                          return <directionalLight key={index} intensity={light.intensity} position={light.position} color={light.color} />;
                        } else if (light.type === 'point') {
                          return <pointLight key={index} intensity={light.intensity} position={light.position} color={light.color} />;
                        } else if (light.type === 'spot') {
                          return <spotLight key={index} intensity={light.intensity} position={light.position} color={light.color} />;
                        }
                        return null;
                      })}

                      <ImageMesh
                        imageData={imageData}
                        depth={depth[0] / 100}
                        imageUrl={imageUrl!}
                        config={sceneConfig}
                      />
                    </Canvas>
                  </div>
                </div>
              )}
            </div>

            {!imageUrl && (
              <div className="text-center p-12 border-2 border-dashed rounded-lg">
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Carica un'immagine per iniziare la conversione 3D
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Editor Configurazione Scena */}
      {imageData && (
        <div className="mt-6">
          <SceneConfigEditor config={sceneConfig} onConfigChange={setSceneConfig} />
        </div>
      )}
    </div>
  );
};

// Componente per il mesh 3D generato dall'immagine
interface ImageMeshProps {
  imageData: ImageData;
  depth: number;
  imageUrl: string;
  config: SceneConfig;
}

const ImageMesh = ({ imageData, depth, imageUrl, config }: ImageMeshProps) => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Animazioni
  useFrame((state) => {
    if (meshRef.current && config.animation.enabled) {
      // Rotazione
      meshRef.current.rotation.x += config.animation.rotationSpeed[0];
      meshRef.current.rotation.y += config.animation.rotationSpeed[1];
      meshRef.current.rotation.z += config.animation.rotationSpeed[2];

      // Bounce effect
      if (config.animation.bounceAmplitude > 0) {
        meshRef.current.position.y =
          config.transform.position[1] +
          Math.sin(state.clock.elapsedTime * config.animation.bounceSpeed) * config.animation.bounceAmplitude;
      }
    }
  });

  // Crea la geometria basata sui dati dell'immagine
  const geometry = useCallback(() => {
    const width = imageData.width;
    const height = imageData.height;
    const geometry = new THREE.PlaneGeometry(4, 4 * (height / width), width - 1, height - 1);

    const vertices = geometry.attributes.position.array as Float32Array;

    // Modifica la profondità Z in base alla luminosità
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        const idx = (j * width + i) * 4;
        const r = imageData.data[idx];
        const g = imageData.data[idx + 1];
        const b = imageData.data[idx + 2];

        // Calcola la luminosità
        const brightness = (r + g + b) / 3 / 255;

        // Applica la profondità
        const vertexIdx = (j * width + i) * 3 + 2;
        vertices[vertexIdx] = brightness * depth;
      }
    }

    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();

    return geometry;
  }, [imageData, depth]);

  return (
    <mesh
      ref={meshRef}
      geometry={geometry()}
      rotation={config.transform.rotation}
      scale={config.transform.scale}
      position={config.transform.position}
    >
      <meshStandardMaterial
        map={new THREE.TextureLoader().load(imageUrl)}
        metalness={config.material.metalness}
        roughness={config.material.roughness}
        color={config.material.color}
        emissive={config.material.emissive}
        emissiveIntensity={config.material.emissiveIntensity}
      />
    </mesh>
  );
};
