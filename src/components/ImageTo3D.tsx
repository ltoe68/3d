import { useState, useRef, useCallback, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Upload, RotateCcw, Video, Volume2, Download, Sparkles, Brain, Loader2 } from 'lucide-react';
import { SceneConfigEditor } from './SceneConfigEditor';
import type { SceneConfig } from '@/types/scene-config';
import { defaultSceneConfig } from '@/types/scene-config';
import * as THREE from 'three';
import {
  checkOllamaAvailability,
  getAvailableModels,
  analyzeImageWithAI,
  removeBackgroundWithAI,
  generateConfigFromAIAnalysis,
  type ImageAnalysisResult
} from '@/lib/ollama-ai';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

interface ImageTo3DProps {
  className?: string;
}

export const ImageTo3D = ({ className }: ImageTo3DProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [depth, setDepth] = useState([30]);
  const [resolution, setResolution] = useState([50]);
  const [sceneConfig, setSceneConfig] = useState<SceneConfig>(defaultSceneConfig);
  const [videoFrames, setVideoFrames] = useState<string[]>([]);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [extractedAudioUrl, setExtractedAudioUrl] = useState<string | null>(null);
  const [audioFileName, setAudioFileName] = useState<string>('');
  const [isExtractingAudio, setIsExtractingAudio] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Stati per AI
  const [isOllamaAvailable, setIsOllamaAvailable] = useState(false);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<ImageAnalysisResult | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>('llama3.2-vision');

  // Controlla disponibilità Ollama all'avvio
  useEffect(() => {
    const checkAI = async () => {
      const available = await checkOllamaAvailability();
      setIsOllamaAvailable(available);
      if (available) {
        const models = await getAvailableModels();
        setAvailableModels(models);
        // Seleziona automaticamente un modello vision se disponibile
        const visionModel = models.find(m =>
          m.includes('vision') || m.includes('llava') || m.includes('qwen')
        );
        if (visionModel) setSelectedModel(visionModel);
      }
    };
    checkAI();
  }, []);

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

  const handleVideoUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Salva il nome del file per l'audio
    setAudioFileName(file.name.replace(/\.[^/.]+$/, '') + '_audio.mp3');

    const video = document.createElement('video');
    const url = URL.createObjectURL(file);
    video.src = url;

    // Estrai l'audio dal video
    extractAudioFromVideo(file);

    video.onloadedmetadata = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const maxSize = resolution[0];
      const scale = Math.min(maxSize / video.videoWidth, maxSize / video.videoHeight);
      canvas.width = Math.floor(video.videoWidth * scale);
      canvas.height = Math.floor(video.videoHeight * scale);

      const frames: string[] = [];
      const fps = 10; // Estrai 10 frame al secondo
      const duration = video.duration;
      const frameCount = Math.min(30, Math.floor(duration * fps)); // Max 30 frames

      let currentFrame = 0;
      const captureFrame = () => {
        if (currentFrame >= frameCount) {
          setVideoFrames(frames);
          if (frames.length > 0) {
            // Carica il primo frame
            const img = new Image();
            img.onload = () => {
              const imgCanvas = document.createElement('canvas');
              imgCanvas.width = canvas.width;
              imgCanvas.height = canvas.height;
              const imgCtx = imgCanvas.getContext('2d');
              if (imgCtx) {
                imgCtx.drawImage(img, 0, 0, canvas.width, canvas.height);
                const data = imgCtx.getImageData(0, 0, canvas.width, canvas.height);
                setImageData(data);
                setImageUrl(frames[0]);
              }
            };
            img.src = frames[0];
          }
          URL.revokeObjectURL(url);
          return;
        }

        video.currentTime = currentFrame / fps;
      };

      video.onseeked = () => {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        frames.push(canvas.toDataURL('image/jpeg', 0.8));
        currentFrame++;
        captureFrame();
      };

      captureFrame();
    };

    video.load();
  }, [resolution]);

  // Funzione per estrarre l'audio dal video
  const extractAudioFromVideo = async (videoFile: File) => {
    setIsExtractingAudio(true);
    try {
      // Crea un elemento video per caricare il file
      const videoElement = document.createElement('video');
      const videoUrl = URL.createObjectURL(videoFile);
      videoElement.src = videoUrl;

      await new Promise((resolve) => {
        videoElement.onloadedmetadata = resolve;
      });

      // Crea un AudioContext
      const audioContext = new AudioContext();

      // Crea un MediaElementSource dal video
      const source = audioContext.createMediaElementSource(videoElement);

      // Crea un MediaStreamDestination
      const destination = audioContext.createMediaStreamDestination();
      source.connect(destination);

      // Crea un MediaRecorder per registrare l'audio
      const mediaRecorder = new MediaRecorder(destination.stream);
      const audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setExtractedAudioUrl(audioUrl);
        setIsExtractingAudio(false);

        // Salva in localStorage (come base64)
        const reader = new FileReader();
        reader.onloadend = () => {
          try {
            localStorage.setItem('extracted_audio', reader.result as string);
            localStorage.setItem('audio_filename', audioFileName);
            console.log('✅ Audio estratto e salvato');
          } catch (error) {
            console.error('Audio troppo grande per localStorage:', error);
          }
        };
        reader.readAsDataURL(audioBlob);
      };

      // Avvia la registrazione e il video
      mediaRecorder.start();
      videoElement.play();

      // Ferma la registrazione quando il video finisce o dopo 30 secondi
      videoElement.onended = () => {
        mediaRecorder.stop();
        URL.revokeObjectURL(videoUrl);
      };

      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
          videoElement.pause();
          URL.revokeObjectURL(videoUrl);
        }
      }, Math.min(videoElement.duration * 1000, 30000)); // Max 30 secondi

    } catch (error) {
      console.error('Errore nell\'estrazione audio:', error);
      setIsExtractingAudio(false);
    }
  };

  const handleReset = () => {
    setImageUrl(null);
    setImageData(null);
    setVideoFrames([]);
    setCurrentFrameIndex(0);
    setExtractedAudioUrl(null);
    setAudioFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (videoInputRef.current) {
      videoInputRef.current.value = '';
    }
  };

  // Download audio estratto
  const downloadAudio = () => {
    if (!extractedAudioUrl) return;
    const a = document.createElement('a');
    a.href = extractedAudioUrl;
    a.download = audioFileName || 'extracted_audio.webm';
    a.click();
  };

  // Cambia frame del video
  const handleFrameChange = useCallback((frameIndex: number) => {
    if (frameIndex < 0 || frameIndex >= videoFrames.length) return;

    setCurrentFrameIndex(frameIndex);
    const frameUrl = videoFrames[frameIndex];

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
        setImageUrl(frameUrl);
      }
    };
    img.src = frameUrl;
  }, [videoFrames, resolution]);

  // Conversione intelligente con AI
  const handleIntelligentConversion = async () => {
    if (!imageUrl || !imageData) return;

    setIsAnalyzing(true);
    try {
      // 1. Analizza l'immagine con AI
      console.log('🤖 Analisi AI in corso con modello:', selectedModel);
      const analysis = await analyzeImageWithAI(imageUrl, { model: selectedModel });
      setAiAnalysis(analysis);

      console.log('✅ Analisi completata:', analysis);

      // 2. Rimuovi lo sfondo se necessario
      let processedImageData = imageData;
      if (analysis.hasBackground && analysis.confidence > 0.5) {
        console.log('🎨 Rimozione sfondo...');
        processedImageData = await removeBackgroundWithAI(imageData, analysis);
        setImageData(processedImageData);
      }

      // 3. Applica configurazioni suggerite
      const aiConfig = generateConfigFromAIAnalysis(analysis);
      setDepth([aiConfig.depth]);

      console.log('🎯 Configurazioni applicate:', aiConfig);

      setIsAnalyzing(false);
    } catch (error) {
      console.error('Errore nella conversione intelligente:', error);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-6 h-6" />
            Studio 3D con AI - Conversione Intelligente
          </CardTitle>
          <CardDescription>
            Carica immagini o video e lascia che l'intelligenza artificiale analizzi automaticamente i soggetti,
            rimuova lo sfondo e suggerisca le migliori configurazioni 3D. Estrazione audio inclusa.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Upload Section */}
            <div className="flex gap-4 flex-wrap">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                className="hidden"
                id="video-upload"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Carica Immagine
              </Button>
              <Button
                onClick={() => videoInputRef.current?.click()}
                variant="secondary"
                className="flex items-center gap-2"
              >
                <Video className="w-4 h-4" />
                Carica Video
              </Button>
              {imageUrl && (
                <>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </Button>
                  {isOllamaAvailable && (
                    <Button
                      onClick={handleIntelligentConversion}
                      disabled={isAnalyzing}
                      className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Analisi AI...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Conversione Intelligente
                        </>
                      )}
                    </Button>
                  )}
                </>
              )}
            </div>

            {/* AI Status Badge */}
            <div className="flex items-center gap-2 flex-wrap">
              {isOllamaAvailable ? (
                <Badge variant="default" className="bg-green-600">
                  <Brain className="w-3 h-3 mr-1" />
                  AI Ollama Attiva ({availableModels.length} modelli)
                </Badge>
              ) : (
                <Alert>
                  <Brain className="w-4 h-4" />
                  <AlertDescription>
                    <strong>AI non disponibile.</strong> Per usare l'analisi intelligente, installa Ollama:
                    <code className="block mt-2 p-2 bg-muted rounded text-xs">
                      # Mac/Linux<br/>
                      curl https://ollama.ai/install.sh | sh<br/>
                      ollama pull llama3.2-vision<br/><br/>
                      # Oppure installa qwen2-vl per migliore analisi<br/>
                      ollama pull qwen2-vl
                    </code>
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* AI Analysis Results */}
            {aiAnalysis && (
              <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 border-indigo-200 dark:border-indigo-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    Analisi AI Completata
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-sm font-semibold">Soggetto Principale:</Label>
                    <p className="text-sm">{aiAnalysis.subject}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold">Descrizione:</Label>
                    <p className="text-sm text-muted-foreground">{aiAnalysis.description}</p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant={aiAnalysis.hasBackground ? "secondary" : "outline"}>
                      {aiAnalysis.hasBackground ? "Con sfondo" : "Senza sfondo"}
                    </Badge>
                    <Badge variant="outline">Profondità: {aiAnalysis.suggestedDepth}</Badge>
                    <Badge variant="outline">Luce: {aiAnalysis.suggestedLighting}</Badge>
                    <Badge variant="outline">Confidenza: {Math.round(aiAnalysis.confidence * 100)}%</Badge>
                  </div>
                  {aiAnalysis.objects.length > 0 && (
                    <div>
                      <Label className="text-sm font-semibold">Oggetti Riconosciuti:</Label>
                      <div className="flex gap-1 flex-wrap mt-1">
                        {aiAnalysis.objects.map((obj, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {obj}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Video Frame Selector */}
            {videoFrames.length > 0 && (
              <div className="space-y-2">
                <Label>Frame Video: {currentFrameIndex + 1} / {videoFrames.length}</Label>
                <Slider
                  value={[currentFrameIndex]}
                  onValueChange={(value) => handleFrameChange(value[0])}
                  min={0}
                  max={videoFrames.length - 1}
                  step={1}
                />
                <p className="text-sm text-muted-foreground">
                  Scorri per selezionare il frame da cui estrarre il personaggio 3D
                </p>
              </div>
            )}

            {/* Audio Player - Campione Vocale Estratto */}
            {isExtractingAudio && (
              <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <Volume2 className="w-5 h-5 text-blue-600 animate-pulse" />
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      🎵 Estrazione audio dal video in corso...
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {extractedAudioUrl && (
              <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-200 dark:border-purple-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Volume2 className="w-5 h-5" />
                    🎤 Campione Vocale Estratto
                  </CardTitle>
                  <CardDescription>
                    Audio estratto dal video: {audioFileName}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <audio
                    ref={audioRef}
                    src={extractedAudioUrl}
                    controls
                    className="w-full"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={downloadAudio}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Scarica Audio
                    </Button>
                  </div>
                  <div className="p-3 bg-white dark:bg-gray-900 rounded-lg border">
                    <p className="text-sm text-muted-foreground">
                      💡 <strong>Tip:</strong> Questo campione vocale è stato automaticamente estratto dal tuo video
                      e salvato nel browser. Puoi usarlo per i tuoi progetti!
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Original Image */}
              {imageUrl && (
                <div className="space-y-2">
                  <Label>Immagine Originale {videoFrames.length > 0 && `(Frame ${currentFrameIndex + 1})`}</Label>
                  <div className="border rounded-lg overflow-hidden bg-muted">
                    <img
                      src={imageUrl}
                      alt="Uploaded"
                      className="w-full h-[700px] object-contain"
                    />
                  </div>
                </div>
              )}

              {/* 3D View */}
              {imageData && (
                <div className="space-y-2">
                  <Label>Vista 3D Interattiva</Label>
                  <div className="border rounded-lg overflow-hidden h-[700px]" style={{ background: sceneConfig.background }}>
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
              <div className="text-center p-12 border-2 border-dashed rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
                <div className="flex justify-center gap-4 mb-4">
                  <Upload className="w-12 h-12 text-primary" />
                  <Video className="w-12 h-12 text-primary" />
                  {isOllamaAvailable && <Brain className="w-12 h-12 text-primary animate-pulse" />}
                </div>
                <p className="text-foreground mb-2 font-bold text-lg">
                  🚀 Carica un'immagine o un video per iniziare
                </p>
                <p className="text-sm text-muted-foreground mb-3">
                  {isOllamaAvailable ? (
                    <>
                      L'<strong>AI analizzerà automaticamente</strong> il contenuto, identificherà i soggetti principali,
                      rimuoverà lo sfondo e suggerirà le configurazioni 3D ottimali!
                    </>
                  ) : (
                    <>
                      Il sistema estrarrà frame dal video e convertirà in 3D.
                      Installa Ollama per analisi AI avanzata!
                    </>
                  )}
                </p>
                {isOllamaAvailable && (
                  <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-sm">
                    <Sparkles className="w-4 h-4" />
                    <span>AI Pronta - Conversione Intelligente Attiva</span>
                  </div>
                )}
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
