import { useState, useRef, Suspense, useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, useGLTF, useTexture, Html } from '@react-three/drei';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Upload, RotateCcw, Box, Film } from 'lucide-react';
import { SceneConfig } from '@/types/scene-config';
import * as THREE from 'three';

interface Model3DLoaderProps {
  config: SceneConfig;
  className?: string;
}

export const Model3DLoader = ({ config, className }: Model3DLoaderProps) => {
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'3d' | 'video' | null>(null);
  const model3DInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handle3DUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setModelUrl(url);
    setFileType('3d');
    setVideoUrl(null);
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    setFileType('video');
    setModelUrl(null);
  };

  const handleReset = () => {
    setModelUrl(null);
    setVideoUrl(null);
    setFileType(null);
    if (model3DInputRef.current) model3DInputRef.current.value = '';
    if (videoInputRef.current) videoInputRef.current.value = '';
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle>Carica Modello 3D o Video</CardTitle>
          <CardDescription>
            Importa modelli 3D (GLB, GLTF) o video MP4 per texture 3D
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Upload Buttons */}
            <div className="flex gap-4 flex-wrap">
              <input
                ref={model3DInputRef}
                type="file"
                accept=".glb,.gltf"
                onChange={handle3DUpload}
                className="hidden"
                id="model-3d-upload"
              />
              <Button
                onClick={() => model3DInputRef.current?.click()}
                className="flex items-center gap-2"
              >
                <Box className="w-4 h-4" />
                Carica Modello 3D
              </Button>

              <input
                ref={videoInputRef}
                type="file"
                accept="video/mp4"
                onChange={handleVideoUpload}
                className="hidden"
                id="video-upload"
              />
              <Button
                onClick={() => videoInputRef.current?.click()}
                variant="secondary"
                className="flex items-center gap-2"
              >
                <Film className="w-4 h-4" />
                Carica Video MP4
              </Button>

              {(modelUrl || videoUrl) && (
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

            {/* 3D Viewer */}
            {(modelUrl || videoUrl) && (
              <div className="space-y-2">
                <Label>Anteprima 3D</Label>
                <div
                  className="border rounded-lg overflow-hidden h-96"
                  style={{ background: config.background }}
                >
                  <Canvas>
                    <PerspectiveCamera makeDefault position={[0, 0, 5]} />
                    <OrbitControls enableDamping />

                    {/* Luci configurabili */}
                    {config.lights.map((light, index) => {
                      if (light.type === 'ambient') {
                        return <ambientLight key={index} intensity={light.intensity} color={light.color} />;
                      } else if (light.type === 'directional') {
                        return <directionalLight key={index} intensity={light.intensity} position={light.position} color={light.color} />;
                      } else if (light.type === 'point') {
                        return <pointLight key={index} intensity={light.intensity} position={light.position} color={light.color} />;
                      }
                      return null;
                    })}

                    <Suspense fallback={<LoadingPlaceholder />}>
                      {fileType === '3d' && modelUrl && (
                        <Model3D url={modelUrl} config={config} />
                      )}
                      {fileType === 'video' && videoUrl && (
                        <VideoMesh url={videoUrl} config={config} />
                      )}
                    </Suspense>
                  </Canvas>
                </div>
              </div>
            )}

            {!(modelUrl || videoUrl) && (
              <div className="text-center p-12 border-2 border-dashed rounded-lg">
                <div className="flex justify-center gap-4 mb-4">
                  <Box className="w-12 h-12 text-muted-foreground" />
                  <Film className="w-12 h-12 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">
                  Carica un modello 3D (GLB/GLTF) o un video MP4
                </p>
              </div>
            )}

            {/* Info */}
            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">💡 Formati Supportati</h4>
              <ul className="text-sm text-blue-700 dark:text-blue-300 list-disc list-inside space-y-1">
                <li><strong>Modelli 3D:</strong> GLB, GLTF (formato standard per web 3D)</li>
                <li><strong>Video:</strong> MP4 (verrà applicato come texture su un piano 3D)</li>
                <li>I modelli 3D possono includere animazioni, texture e materiali</li>
                <li>I video vengono riprodotti in loop sulla superficie 3D</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Componente per caricare e visualizzare modelli 3D
interface Model3DProps {
  url: string;
  config: SceneConfig;
}

const Model3D = ({ url, config }: Model3DProps) => {
  const { scene } = useGLTF(url);
  const meshRef = useRef<THREE.Group>(null);

  // Applica trasformazioni e animazioni
  THREE.DefaultLoadingManager.onLoad = () => {
    if (meshRef.current) {
      meshRef.current.rotation.set(...config.transform.rotation);
      meshRef.current.scale.set(...config.transform.scale);
      meshRef.current.position.set(...config.transform.position);
    }
  };

  return <primitive ref={meshRef} object={scene} />;
};

// Componente per video come texture 3D
interface VideoMeshProps {
  url: string;
  config: SceneConfig;
}

const VideoMesh = ({ url, config }: VideoMeshProps) => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Crea il video element con useMemo
  const video = useMemo(() => {
    const vid = document.createElement('video');
    vid.src = url;
    vid.loop = true;
    vid.muted = true;
    vid.playsInline = true;
    vid.crossOrigin = 'anonymous';
    return vid;
  }, [url]);

  // Avvia il video quando è pronto
  useEffect(() => {
    video.play().catch(err => console.log('Video autoplay prevented:', err));
  }, [video]);

  return (
    <mesh
      ref={meshRef}
      rotation={config.transform.rotation}
      scale={config.transform.scale}
      position={config.transform.position}
    >
      <planeGeometry args={[4, 3]} />
      <meshStandardMaterial
        metalness={config.material.metalness}
        roughness={config.material.roughness}
      >
        <videoTexture attach="map" args={[video]} />
      </meshStandardMaterial>
    </mesh>
  );
};

// Placeholder durante il caricamento
const LoadingPlaceholder = () => {
  return (
    <Html center>
      <div className="text-white bg-black bg-opacity-50 px-4 py-2 rounded">
        Caricamento...
      </div>
    </Html>
  );
};
