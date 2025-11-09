import { AudioConfig, musicPresets, dialoguePresets } from '@/types/audio-config';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Music, MessageSquare } from 'lucide-react';

interface AudioConfigEditorProps {
  config: AudioConfig;
  onConfigChange: (config: AudioConfig) => void;
}

export const AudioConfigEditor = ({ config, onConfigChange }: AudioConfigEditorProps) => {
  const handleMusicToggle = (enabled: boolean) => {
    onConfigChange({
      ...config,
      music: {
        ...config.music,
        enabled
      }
    });
  };

  const handleDialogueToggle = (enabled: boolean) => {
    onConfigChange({
      ...config,
      dialogues: {
        ...config.dialogues,
        enabled
      }
    });
  };

  const handleMusicPreset = (preset: string) => {
    onConfigChange({
      ...config,
      music: {
        ...config.music,
        tracks: musicPresets[preset],
        currentTrackIndex: 0,
        enabled: true
      }
    });
  };

  const handleDialoguePreset = (preset: string) => {
    onConfigChange({
      ...config,
      dialogues: {
        ...config.dialogues,
        lines: dialoguePresets[preset],
        enabled: true
      }
    });
  };

  const handleAutoPlayToggle = (autoPlay: boolean) => {
    onConfigChange({
      ...config,
      dialogues: {
        ...config.dialogues,
        autoPlay
      }
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="w-5 h-5" />
          Audio & Dialogue Configuration
        </CardTitle>
        <CardDescription>
          Aggiungi musica di sottofondo e dialoghi alla tua scena 3D
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="music" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="music">Musica</TabsTrigger>
            <TabsTrigger value="dialogues">Dialoghi</TabsTrigger>
          </TabsList>

          <TabsContent value="music" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Abilita Musica</Label>
                <p className="text-sm text-muted-foreground">
                  Attiva la riproduzione musicale di sottofondo
                </p>
              </div>
              <Switch
                checked={config.music.enabled}
                onCheckedChange={handleMusicToggle}
              />
            </div>

            {config.music.enabled && (
              <>
                <div className="space-y-2">
                  <Label>Preset Musicali</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Button
                      variant="outline"
                      className="h-auto flex flex-col items-start p-4"
                      onClick={() => handleMusicPreset('cinematico')}
                    >
                      <div className="font-semibold mb-1">🎬 Cinematico</div>
                      <div className="text-xs text-muted-foreground text-left">
                        Orchestrale epico per scene drammatiche
                      </div>
                    </Button>

                    <Button
                      variant="outline"
                      className="h-auto flex flex-col items-start p-4"
                      onClick={() => handleMusicPreset('rilassante')}
                    >
                      <div className="font-semibold mb-1">🌊 Rilassante</div>
                      <div className="text-xs text-muted-foreground text-left">
                        Ambient spaziale e atmosferico
                      </div>
                    </Button>

                    <Button
                      variant="outline"
                      className="h-auto flex flex-col items-start p-4"
                      onClick={() => handleMusicPreset('elettronico')}
                    >
                      <div className="font-semibold mb-1">⚡ Elettronico</div>
                      <div className="text-xs text-muted-foreground text-left">
                        Synthwave e suoni digitali
                      </div>
                    </Button>
                  </div>
                </div>

                {config.music.tracks.length > 0 && (
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">Tracce Caricate</h4>
                    <ul className="space-y-2">
                      {config.music.tracks.map((track, index) => (
                        <li
                          key={track.id}
                          className="flex items-center gap-2 text-sm"
                        >
                          <Music className="w-4 h-4" />
                          <span className={index === config.music.currentTrackIndex ? 'font-semibold' : ''}>
                            {track.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="dialogues" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Abilita Dialoghi</Label>
                <p className="text-sm text-muted-foreground">
                  Attiva i dialoghi con sintesi vocale
                </p>
              </div>
              <Switch
                checked={config.dialogues.enabled}
                onCheckedChange={handleDialogueToggle}
              />
            </div>

            {config.dialogues.enabled && (
              <>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Riproduzione Automatica</Label>
                    <p className="text-sm text-muted-foreground">
                      Avvia automaticamente i dialoghi
                    </p>
                  </div>
                  <Switch
                    checked={config.dialogues.autoPlay}
                    onCheckedChange={handleAutoPlayToggle}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Preset Dialoghi</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      className="h-auto flex flex-col items-start p-4"
                      onClick={() => handleDialoguePreset('vitigni')}
                    >
                      <div className="font-semibold mb-1">🍇 Vitigni</div>
                      <div className="text-xs text-muted-foreground text-left">
                        Dialoghi dei personaggi vitigni
                      </div>
                    </Button>

                    <Button
                      variant="outline"
                      className="h-auto flex flex-col items-start p-4"
                      onClick={() => handleDialoguePreset('motivazionale')}
                    >
                      <div className="font-semibold mb-1">💪 Motivazionale</div>
                      <div className="text-xs text-muted-foreground text-left">
                        Messaggi di benvenuto e suggerimenti
                      </div>
                    </Button>
                  </div>
                </div>

                {config.dialogues.lines.length > 0 && (
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">Dialoghi Caricati</h4>
                    <ul className="space-y-2">
                      {config.dialogues.lines.map((line) => (
                        <li
                          key={line.id}
                          className="flex items-start gap-2 text-sm"
                        >
                          <MessageSquare className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <div>
                            {line.speaker && (
                              <span className="font-semibold">{line.speaker}: </span>
                            )}
                            <span className="text-muted-foreground italic">
                              "{line.text.substring(0, 50)}{line.text.length > 50 ? '...' : ''}"
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}

            <div className="p-3 bg-amber-50 dark:bg-amber-950 rounded-lg border border-amber-200 dark:border-amber-800">
              <p className="text-xs text-amber-700 dark:text-amber-300">
                ⚙️ <strong>Impostazioni Voce TTS:</strong> Le impostazioni della voce (pitch, rate, volume)
                possono essere personalizzate modificando la configurazione JSON nell'editor generale.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
