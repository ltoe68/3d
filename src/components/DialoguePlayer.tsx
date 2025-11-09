import { useState, useEffect, useRef } from 'react';
import { AudioConfig, DialogueLine } from '@/types/audio-config';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Play, Pause, SkipForward } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface DialoguePlayerProps {
  config: AudioConfig;
  onConfigChange: (config: AudioConfig) => void;
}

export const DialoguePlayer = ({ config }: DialoguePlayerProps) => {
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const speechSynthRef = useRef<SpeechSynthesisUtterance | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentDialogue = config.dialogues.lines[currentDialogueIndex];

  useEffect(() => {
    if (config.dialogues.enabled && config.dialogues.autoPlay && !isPlaying) {
      handlePlay();
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (speechSynthRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, [config.dialogues.enabled]);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);

      if (config.dialogues.voiceSettings) {
        utterance.pitch = config.dialogues.voiceSettings.pitch;
        utterance.rate = config.dialogues.voiceSettings.rate;
        utterance.volume = config.dialogues.voiceSettings.volume;

        // Seleziona una voce specifica se impostata
        if (config.dialogues.voiceSettings.voice) {
          const voices = window.speechSynthesis.getVoices();
          const selectedVoice = voices.find(
            voice => voice.name === config.dialogues.voiceSettings?.voice
          );
          if (selectedVoice) {
            utterance.voice = selectedVoice;
          }
        }
      }

      utterance.onstart = () => {
        setIsPlaying(true);
      };

      utterance.onend = () => {
        setIsPlaying(false);
        setProgress(100);
        // Passa al dialogo successivo
        setTimeout(() => {
          handleNext();
        }, 1000);
      };

      speechSynthRef.current = utterance;
      window.speechSynthesis.speak(utterance);

      // Simula il progresso
      const duration = (currentDialogue?.duration || 3) * 1000;
      simulateProgress(duration);
    }
  };

  const simulateProgress = (duration: number) => {
    const steps = 100;
    const interval = duration / steps;
    let current = 0;

    const progressInterval = setInterval(() => {
      current += 1;
      setProgress(current);
      if (current >= 100) {
        clearInterval(progressInterval);
      }
    }, interval);
  };

  const handlePlay = () => {
    if (currentDialogue) {
      const delay = currentDialogue.delay || 0;

      timeoutRef.current = setTimeout(() => {
        if (currentDialogue.audioUrl) {
          // Se c'è un URL audio, riproducilo
          const audio = new Audio(currentDialogue.audioUrl);
          audio.play();
          audio.onended = () => {
            setIsPlaying(false);
            handleNext();
          };
          setIsPlaying(true);
        } else {
          // Altrimenti usa TTS
          speakText(currentDialogue.text);
        }
      }, delay * 1000);
    }
  };

  const handlePause = () => {
    if (speechSynthRef.current) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
    }
  };

  const handleNext = () => {
    if (currentDialogueIndex < config.dialogues.lines.length - 1) {
      setCurrentDialogueIndex(currentDialogueIndex + 1);
      setProgress(0);
      if (config.dialogues.autoPlay) {
        setTimeout(() => handlePlay(), 500);
      }
    } else {
      // Reset al primo dialogo
      setCurrentDialogueIndex(0);
      setProgress(0);
      setIsPlaying(false);
    }
  };

  if (!config.dialogues.enabled || config.dialogues.lines.length === 0) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Dialogue Player
        </CardTitle>
        <CardDescription>
          {currentDialogue?.speaker || 'Narrator'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Dialogue Text */}
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm italic">"{currentDialogue?.text}"</p>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>
                Dialogo {currentDialogueIndex + 1} di {config.dialogues.lines.length}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <Button
              size="icon"
              onClick={isPlaying ? handlePause : handlePlay}
              disabled={!currentDialogue}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              disabled={config.dialogues.lines.length <= 1}
            >
              <SkipForward className="w-4 h-4" />
            </Button>
          </div>

          {/* Info */}
          <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-xs text-blue-700 dark:text-blue-300">
              💡 I dialoghi utilizzano la sintesi vocale del browser (Text-to-Speech).
              Alcune voci potrebbero non essere disponibili su tutti i dispositivi.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
