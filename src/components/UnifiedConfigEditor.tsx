import { useState } from 'react';
import { UnifiedConfig, defaultUnifiedConfig, unifiedPresets } from '@/types/unified-config';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileCode, Play, RotateCcw, AlertCircle } from 'lucide-react';

interface UnifiedConfigEditorProps {
  config: UnifiedConfig;
  onConfigChange: (config: UnifiedConfig) => void;
}

export const UnifiedConfigEditor = ({ config, onConfigChange }: UnifiedConfigEditorProps) => {
  const [scriptText, setScriptText] = useState(JSON.stringify(config, null, 2));
  const [error, setError] = useState<string | null>(null);

  const handleApplyScript = () => {
    try {
      const parsed = JSON.parse(scriptText);
      onConfigChange(parsed);
      setError(null);
    } catch (err) {
      setError('Errore nel parsing JSON: ' + (err as Error).message);
    }
  };

  const handleReset = () => {
    const defaultConfig = JSON.stringify(defaultUnifiedConfig, null, 2);
    setScriptText(defaultConfig);
    onConfigChange(defaultUnifiedConfig);
    setError(null);
  };

  const applyPreset = (preset: UnifiedConfig) => {
    setScriptText(JSON.stringify(preset, null, 2));
    onConfigChange(preset);
    setError(null);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileCode className="w-5 h-5" />
          Editor Configurazione Completa (Scena + Audio)
        </CardTitle>
        <CardDescription>
          Personalizza scene 3D, luci, materiali, musica e dialoghi tutto in un unico script JSON
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="editor" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="editor">Editor JSON</TabsTrigger>
            <TabsTrigger value="presets">Preset Unificati</TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="space-y-4">
            <div className="space-y-2">
              <Label>Configurazione JSON Completa</Label>
              <Textarea
                value={scriptText}
                onChange={(e) => setScriptText(e.target.value)}
                className="font-mono text-sm min-h-[500px]"
                placeholder="Inserisci la configurazione JSON completa..."
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2">
              <Button onClick={handleApplyScript} className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                Applica Configurazione
              </Button>
              <Button onClick={handleReset} variant="outline" className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            </div>

            <div className="p-4 bg-muted rounded-lg text-sm space-y-3">
              <h4 className="font-semibold mb-2">Struttura della Configurazione:</h4>

              <div>
                <strong className="text-primary">scene:</strong>
                <ul className="list-disc list-inside ml-4 space-y-1 text-muted-foreground">
                  <li><strong>lights</strong>: array di luci (ambient, directional, point, spot)</li>
                  <li><strong>material</strong>: metalness, roughness, color, emissive</li>
                  <li><strong>transform</strong>: rotation, scale, position</li>
                  <li><strong>animation</strong>: rotationSpeed, bounceAmplitude, bounceSpeed</li>
                  <li><strong>background</strong>: colore di sfondo (hex)</li>
                </ul>
              </div>

              <div>
                <strong className="text-purple-600 dark:text-purple-400">audio:</strong>
                <ul className="list-disc list-inside ml-4 space-y-1 text-muted-foreground">
                  <li><strong>music</strong>: enabled, tracks (array), currentTrackIndex, masterVolume</li>
                  <li><strong>dialogues</strong>: enabled, lines (array), autoPlay, voiceSettings</li>
                  <li><strong>spatialAudio</strong>: enabled, listenerPosition</li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-amber-50 dark:bg-amber-950 rounded-lg border border-amber-200 dark:border-amber-800">
              <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">⚡ Modifica Avanzata</h4>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Puoi modificare qualsiasi parametro direttamente nel JSON. Le modifiche vengono applicate in tempo reale
                quando premi "Applica Configurazione". Usa i preset come punto di partenza!
              </p>
            </div>
          </TabsContent>

          <TabsContent value="presets" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={() => applyPreset(unifiedPresets.cinematico)}
                variant="outline"
                className="h-auto flex flex-col items-start p-4"
              >
                <div className="font-semibold mb-1">🎬 Cinematico</div>
                <div className="text-xs text-muted-foreground text-left">
                  Luci drammatiche + musica orchestrale epica
                </div>
              </Button>

              <Button
                onClick={() => applyPreset(unifiedPresets.vitigni)}
                variant="outline"
                className="h-auto flex flex-col items-start p-4"
              >
                <div className="font-semibold mb-1">🍇 Vitigni</div>
                <div className="text-xs text-muted-foreground text-left">
                  Tema vinicolo con dialoghi dei personaggi
                </div>
              </Button>

              <Button
                onClick={() => applyPreset(unifiedPresets.naturale)}
                variant="outline"
                className="h-auto flex flex-col items-start p-4"
              >
                <div className="font-semibold mb-1">🌞 Naturale</div>
                <div className="text-xs text-muted-foreground text-left">
                  Illuminazione morbida + suoni naturali
                </div>
              </Button>
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">💡 Come usare i preset</h4>
              <p className="text-sm text-green-700 dark:text-green-300">
                I preset unificati configurano automaticamente sia la scena 3D che l'audio.
                Dopo aver selezionato un preset, puoi passare all'Editor JSON per personalizzare ulteriormente
                ogni aspetto della configurazione!
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
