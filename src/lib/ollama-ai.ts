/**
 * Integrazione con Ollama per analisi intelligente di immagini e video
 * Supporta modelli vision come llama3.2-vision, qwen2-vl, bakllava
 */

const OLLAMA_BASE_URL = 'http://localhost:11434';

export interface OllamaConfig {
  model: string;
  baseUrl?: string;
}

export interface ImageAnalysisResult {
  subject: string;
  description: string;
  hasBackground: boolean;
  suggestedDepth: number;
  suggestedLighting: 'dramatic' | 'natural' | 'soft';
  confidence: number;
  objects: string[];
}

/**
 * Verifica se Ollama è disponibile
 */
export async function checkOllamaAvailability(): Promise<boolean> {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
      method: 'GET',
    });
    return response.ok;
  } catch (error) {
    console.error('Ollama non disponibile:', error);
    return false;
  }
}

/**
 * Ottieni lista dei modelli installati
 */
export async function getAvailableModels(): Promise<string[]> {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
    if (!response.ok) return [];

    const data = await response.json();
    return data.models?.map((m: any) => m.name) || [];
  } catch (error) {
    console.error('Errore nel recupero modelli:', error);
    return [];
  }
}

/**
 * Analizza un'immagine usando Ollama con un modello vision
 */
export async function analyzeImageWithAI(
  imageBase64: string,
  config: OllamaConfig = { model: 'llama3.2-vision' }
): Promise<ImageAnalysisResult> {
  try {
    const prompt = `Analizza questa immagine e rispondi SOLO in formato JSON con questa struttura:
{
  "subject": "descrizione breve del soggetto principale",
  "description": "descrizione dettagliata",
  "hasBackground": true/false,
  "suggestedDepth": numero tra 10 e 100,
  "suggestedLighting": "dramatic" o "natural" o "soft",
  "confidence": numero tra 0 e 1,
  "objects": ["lista", "oggetti", "riconosciuti"]
}

Identifica il soggetto principale, se ha sfondo complesso, e suggerisci parametri ottimali per conversione 3D.`;

    const response = await fetch(`${config.baseUrl || OLLAMA_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: config.model,
        prompt: prompt,
        images: [imageBase64.split(',')[1]], // Rimuovi il prefixo data:image
        stream: false,
        options: {
          temperature: 0.3,
        }
      }),
    });

    if (!response.ok) {
      throw new Error('Errore nella richiesta Ollama');
    }

    const data = await response.json();
    const responseText = data.response;

    // Estrai il JSON dalla risposta
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Risposta non valida da Ollama');
    }

    const result = JSON.parse(jsonMatch[0]);
    return result;

  } catch (error) {
    console.error('Errore analisi AI:', error);
    // Ritorna valori di default in caso di errore
    return {
      subject: 'Oggetto generico',
      description: 'Impossibile analizzare l\'immagine',
      hasBackground: true,
      suggestedDepth: 30,
      suggestedLighting: 'natural',
      confidence: 0,
      objects: []
    };
  }
}

/**
 * Rimuovi lo sfondo usando l'analisi AI
 * Usa Canvas per processing dell'immagine
 */
export async function removeBackgroundWithAI(
  imageData: ImageData,
  analysisResult: ImageAnalysisResult
): Promise<ImageData> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      resolve(imageData);
      return;
    }

    ctx.putImageData(imageData, 0, 0);

    // Applica algoritmo di edge detection semplificato
    // Per un vero background removal, servirebbero modelli più complessi
    // o integrazioni con servizi esterni

    const newImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = newImageData.data;

    // Se l'AI dice che non c'è background, non fare nulla
    if (!analysisResult.hasBackground) {
      resolve(imageData);
      return;
    }

    // Algoritmo base: rimuovi pixel simili ai bordi (assunti come background)
    const cornerSamples = [
      { x: 0, y: 0 },
      { x: canvas.width - 1, y: 0 },
      { x: 0, y: canvas.height - 1 },
      { x: canvas.width - 1, y: canvas.height - 1 },
    ];

    // Calcola il colore medio dei bordi (presumibilmente sfondo)
    let avgR = 0, avgG = 0, avgB = 0;
    cornerSamples.forEach(pos => {
      const idx = (pos.y * canvas.width + pos.x) * 4;
      avgR += data[idx];
      avgG += data[idx + 1];
      avgB += data[idx + 2];
    });
    avgR /= cornerSamples.length;
    avgG /= cornerSamples.length;
    avgB /= cornerSamples.length;

    // Rimuovi pixel simili al colore di sfondo
    const threshold = 50;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      const diff = Math.sqrt(
        Math.pow(r - avgR, 2) +
        Math.pow(g - avgG, 2) +
        Math.pow(b - avgB, 2)
      );

      if (diff < threshold) {
        data[i + 3] = 0; // Rendi trasparente
      }
    }

    resolve(newImageData);
  });
}

/**
 * Genera suggerimenti per la configurazione 3D basati sull'analisi AI
 */
export function generateConfigFromAIAnalysis(analysis: ImageAnalysisResult) {
  const config = {
    depth: analysis.suggestedDepth,
    lighting: analysis.suggestedLighting,
    material: {
      metalness: 0.3,
      roughness: 0.7,
    },
    animation: {
      enabled: true,
      rotationSpeed: [0, 0.005, 0],
    }
  };

  // Personalizza in base al tipo di soggetto
  if (analysis.objects.some(obj =>
    obj.toLowerCase().includes('person') ||
    obj.toLowerCase().includes('face') ||
    obj.toLowerCase().includes('persona')
  )) {
    config.material.metalness = 0.1;
    config.material.roughness = 0.9;
    config.lighting = 'soft';
  }

  if (analysis.objects.some(obj =>
    obj.toLowerCase().includes('metal') ||
    obj.toLowerCase().includes('metallo')
  )) {
    config.material.metalness = 0.9;
    config.material.roughness = 0.2;
  }

  return config;
}

/**
 * Analizza audio estratto per suggerire configurazioni
 */
export async function analyzeAudioWithAI(
  config: OllamaConfig = { model: 'qwen2.5' }
): Promise<{
  mood: 'energetic' | 'calm' | 'dramatic';
  suggestedMusic: string;
}> {
  // Per l'audio, usiamo un modello text-only
  try {
    const response = await fetch(`${config.baseUrl || OLLAMA_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: config.model,
        prompt: 'Suggerisci un mood musicale appropriato per un video: energetic, calm, o dramatic. Rispondi solo con una parola.',
        stream: false,
      }),
    });

    const data = await response.json();
    const mood = data.response.toLowerCase().trim();

    return {
      mood: mood.includes('calm') ? 'calm' : mood.includes('dramatic') ? 'dramatic' : 'energetic',
      suggestedMusic: mood.includes('calm') ? 'ambient' : mood.includes('dramatic') ? 'orchestral' : 'upbeat'
    };
  } catch (error) {
    console.error('Errore analisi audio:', error);
    return {
      mood: 'calm',
      suggestedMusic: 'ambient'
    };
  }
}
