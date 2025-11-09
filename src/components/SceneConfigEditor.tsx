import { useState } from 'react';
import { SceneConfig, defaultSceneConfig } from '@/types/scene-config';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileCode, Play, RotateCcw, AlertCircle } from 'lucide-react';

interface SceneConfigEditorProps {
  config: SceneConfig;
  onConfigChange: (config: SceneConfig) => void;
}

export const SceneConfigEditor = ({ config, onConfigChange }: SceneConfigEditorProps) => {
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
    const defaultConfig = JSON.stringify(defaultSceneConfig, null, 2);
    setScriptText(defaultConfig);
    onConfigChange(defaultSceneConfig);
    setError(null);
  };

  const presets = {
    cinematico: {
      ...defaultSceneConfig,
      lights: [
        { type: 'ambient' as const, intensity: 0.2, color: '#1a1a2e' },
        { type: 'directional' as const, intensity: 2, position: [5, 10, 5] as [number, number, number], color: '#ff6b6b' },
        { type: 'point' as const, intensity: 1.5, position: [-5, 5, -5] as [number, number, number], color: '#4ecdc4' }
      ],
      material: { metalness: 0.9, roughness: 0.1 },
      background: '#0f0f1e'
    },
    naturale: {
      ...defaultSceneConfig,
      lights: [
        { type: 'ambient' as const, intensity: 0.6, color: '#ffeaa7' },
        { type: 'directional' as const, intensity: 1.2, position: [10, 15, 10] as [number, number, number], color: '#fdcb6e' }
      ],
      material: { metalness: 0.2, roughness: 0.8 },
      background: '#74b9ff'
    },
    neon: {
      ...defaultSceneConfig,
      lights: [
        { type: 'ambient' as const, intensity: 0.1, color: '#000000' },
        { type: 'point' as const, intensity: 2, position: [5, 5, 5] as [number, number, number], color: '#ff00ff' },
        { type: 'point' as const, intensity: 2, position: [-5, 5, -5] as [number, number, number], color: '#00ffff' },
        { type: 'point' as const, intensity: 2, position: [0, -5, 0] as [number, number, number], color: '#ffff00' }
      ],
      material: { metalness: 0.9, roughness: 0.1, emissive: '#ff00ff', emissiveIntensity: 0.5 },
      background: '#000000'
    }
  };

  const applyPreset = (preset: SceneConfig) => {
    setScriptText(JSON.stringify(preset, null, 2));
    onConfigChange(preset);
    setError(null);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileCode className="w-5 h-5" />
          Editor Configurazione Scena 3D
        </CardTitle>
        <CardDescription>
          Personalizza luci, materiali, trasformazioni e animazioni della scena
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="editor" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="editor">Editor JSON</TabsTrigger>
            <TabsTrigger value="presets">Preset</TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="space-y-4">
            <div className="space-y-2">
              <Label>Configurazione JSON</Label>
              <Textarea
                value={scriptText}
                onChange={(e) => setScriptText(e.target.value)}
                className="font-mono text-sm min-h-[400px]"
                placeholder="Inserisci la configurazione JSON..."
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
                Applica
              </Button>
              <Button onClick={handleReset} variant="outline" className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            </div>

            <div className="p-4 bg-muted rounded-lg text-sm">
              <h4 className="font-semibold mb-2">Parametri disponibili:</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li><strong>lights</strong>: array di luci (ambient, directional, point, spot)</li>
                <li><strong>material</strong>: metalness, roughness, color, emissive</li>
                <li><strong>transform</strong>: rotation, scale, position</li>
                <li><strong>animation</strong>: rotationSpeed, bounceAmplitude, bounceSpeed</li>
                <li><strong>background</strong>: colore di sfondo (hex)</li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="presets" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={() => applyPreset(presets.cinematico)}
                variant="outline"
                className="h-auto flex flex-col items-start p-4"
              >
                <div className="font-semibold mb-1">🎬 Cinematico</div>
                <div className="text-xs text-muted-foreground text-left">
                  Luci drammatiche con alto contrasto
                </div>
              </Button>

              <Button
                onClick={() => applyPreset(presets.naturale)}
                variant="outline"
                className="h-auto flex flex-col items-start p-4"
              >
                <div className="font-semibold mb-1">🌞 Naturale</div>
                <div className="text-xs text-muted-foreground text-left">
                  Illuminazione morbida e naturale
                </div>
              </Button>

              <Button
                onClick={() => applyPreset(presets.neon)}
                variant="outline"
                className="h-auto flex flex-col items-start p-4"
              >
                <div className="font-semibold mb-1">💫 Neon</div>
                <div className="text-xs text-muted-foreground text-left">
                  Effetti neon colorati e vibranti
                </div>
              </Button>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">💡 Suggerimento</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Seleziona un preset come punto di partenza, poi passa all'Editor JSON per personalizzarlo ulteriormente!
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
