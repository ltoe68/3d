import { useState, useEffect } from 'react';
import { ImageTo3D } from '@/components/ImageTo3D';
import { Model3DLoader } from '@/components/Model3DLoader';
import { AudioPlayer } from '@/components/AudioPlayer';
import { DialoguePlayer } from '@/components/DialoguePlayer';
import { UnifiedConfigEditor } from '@/components/UnifiedConfigEditor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import type { UnifiedConfig } from '@/types/unified-config';
import type { SceneConfig } from '@/types/scene-config';
import type { AudioConfig } from '@/types/audio-config';
import { defaultUnifiedConfig, unifiedPresets } from '@/types/unified-config';

const STORAGE_KEY = 'studio3d_saved_config';

const ImageTo3DPage = () => {
  // Carica configurazione salvata da localStorage o usa default
  const [unifiedConfig, setUnifiedConfig] = useState<UnifiedConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Errore nel caricamento della configurazione salvata:', error);
    }
    return defaultUnifiedConfig;
  });

  const [sceneConfig, setSceneConfig] = useState<SceneConfig>(unifiedConfig.scene);
  const [audioConfig, setAudioConfig] = useState<AudioConfig>(unifiedConfig.audio);

  // Salva automaticamente in localStorage quando la configurazione cambia
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(unifiedConfig));
      console.log('✅ Configurazione salvata automaticamente');
    } catch (error) {
      console.error('Errore nel salvataggio della configurazione:', error);
    }
  }, [unifiedConfig]);

  // Sincronizza la configurazione unificata quando cambia
  const handleUnifiedConfigChange = (config: UnifiedConfig) => {
    setUnifiedConfig(config);
    setSceneConfig(config.scene);
    setAudioConfig(config.audio);
  };

  // Gestisci il cambio di preset dal menu a tendina
  const handlePresetChange = (presetName: string) => {
    if (presetName === 'default') {
      handleUnifiedConfigChange(defaultUnifiedConfig);
    } else if (presetName === 'cinematico') {
      handleUnifiedConfigChange(unifiedPresets.cinematico);
    } else if (presetName === 'vitigni') {
      handleUnifiedConfigChange(unifiedPresets.vitigni);
    } else if (presetName === 'naturale') {
      handleUnifiedConfigChange(unifiedPresets.naturale);
    }
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

        {/* Menu a Tendina Preset */}
        <Card className="mb-8 p-6">
          <div className="max-w-md mx-auto space-y-3">
            <Label htmlFor="preset-select" className="text-lg font-semibold">
              🎨 Seleziona Preset di Configurazione
            </Label>
            <Select onValueChange={handlePresetChange}>
              <SelectTrigger id="preset-select" className="w-full">
                <SelectValue placeholder="Scegli un preset o usa configurazione salvata" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">
                  <div className="flex items-center gap-2">
                    <span>⚙️</span>
                    <div>
                      <div className="font-semibold">Default</div>
                      <div className="text-xs text-muted-foreground">Configurazione base</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="cinematico">
                  <div className="flex items-center gap-2">
                    <span>🎬</span>
                    <div>
                      <div className="font-semibold">Cinematico</div>
                      <div className="text-xs text-muted-foreground">Luci drammatiche + musica orchestrale</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="vitigni">
                  <div className="flex items-center gap-2">
                    <span>🍇</span>
                    <div>
                      <div className="font-semibold">Vitigni</div>
                      <div className="text-xs text-muted-foreground">Tema vinicolo con dialoghi</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="naturale">
                  <div className="flex items-center gap-2">
                    <span>🌞</span>
                    <div>
                      <div className="font-semibold">Naturale</div>
                      <div className="text-xs text-muted-foreground">Illuminazione morbida + suoni naturali</div>
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground text-center">
              💾 Le tue personalizzazioni vengono salvate automaticamente e ricaricate all'avvio
            </p>
          </div>
        </Card>

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
