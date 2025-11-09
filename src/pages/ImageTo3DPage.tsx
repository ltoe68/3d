import { useState } from 'react';
import { ImageTo3D } from '@/components/ImageTo3D';
import { Model3DLoader } from '@/components/Model3DLoader';
import { AudioPlayer } from '@/components/AudioPlayer';
import { DialoguePlayer } from '@/components/DialoguePlayer';
import { UnifiedConfigEditor } from '@/components/UnifiedConfigEditor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { UnifiedConfig } from '@/types/unified-config';
import type { SceneConfig } from '@/types/scene-config';
import type { AudioConfig } from '@/types/audio-config';
import { defaultUnifiedConfig } from '@/types/unified-config';

const ImageTo3DPage = () => {
  const [unifiedConfig, setUnifiedConfig] = useState<UnifiedConfig>(defaultUnifiedConfig);
  const [sceneConfig, setSceneConfig] = useState<SceneConfig>(defaultUnifiedConfig.scene);
  const [audioConfig, setAudioConfig] = useState<AudioConfig>(defaultUnifiedConfig.audio);

  // Sincronizza la configurazione unificata quando cambia
  const handleUnifiedConfigChange = (config: UnifiedConfig) => {
    setUnifiedConfig(config);
    setSceneConfig(config.scene);
    setAudioConfig(config.audio);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">🎨 Studio 3D Completo</h1>
          <p className="text-xl text-muted-foreground">
            Crea scene 3D da immagini, carica modelli 3D, aggiungi video e personalizza con musica e dialoghi
          </p>
        </div>

        <Tabs defaultValue="image" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="image">Immagine to 3D</TabsTrigger>
            <TabsTrigger value="model">Modelli 3D & Video</TabsTrigger>
          </TabsList>

          <TabsContent value="image">
            <ImageTo3D />
          </TabsContent>

          <TabsContent value="model">
            <Model3DLoader config={sceneConfig} />
          </TabsContent>
        </Tabs>

        {/* Audio Controls */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <AudioPlayer config={audioConfig} onConfigChange={setAudioConfig} />
          <DialoguePlayer config={audioConfig} onConfigChange={setAudioConfig} />
        </div>

        {/* Unified Configuration Editor */}
        <div className="mt-8">
          <UnifiedConfigEditor config={unifiedConfig} onConfigChange={handleUnifiedConfigChange} />
        </div>

        <div className="mt-8 p-6 bg-muted rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Come funziona?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">1</div>
              <h3 className="font-semibold">Carica un'immagine</h3>
              <p className="text-sm text-muted-foreground">
                Seleziona un'immagine dal tuo dispositivo (JPG, PNG, ecc.)
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">2</div>
              <h3 className="font-semibold">Regola i parametri</h3>
              <p className="text-sm text-muted-foreground">
                Modifica la profondità 3D, luci e materiali
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">3</div>
              <h3 className="font-semibold">Aggiungi audio</h3>
              <p className="text-sm text-muted-foreground">
                Scegli musica e dialoghi per un'esperienza immersiva
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">4</div>
              <h3 className="font-semibold">Esplora il modello</h3>
              <p className="text-sm text-muted-foreground">
                Ruota, ingrandisci e goditi la tua creazione 3D
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">💡 Suggerimento Visivo</h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Per risultati migliori, usa immagini con buon contrasto. Le aree chiare appariranno più in alto,
              mentre quelle scure saranno più basse nel modello 3D.
            </p>
          </div>

          <div className="p-6 bg-purple-50 dark:bg-purple-950 rounded-lg border border-purple-200 dark:border-purple-800">
            <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">🎵 Suggerimento Audio</h3>
            <p className="text-sm text-purple-700 dark:text-purple-300">
              I dialoghi usano la sintesi vocale del browser. Per migliori risultati, prova voci diverse
              modificando le impostazioni nel pannello di configurazione JSON.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageTo3DPage;
