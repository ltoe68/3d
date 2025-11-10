# 🤖 Guida all'Installazione di Ollama per AI Intelligente

Studio 3D Vitigni supporta l'integrazione con **Ollama** per l'analisi intelligente di immagini e video usando modelli AI locali.

## Cos'è Ollama?

Ollama è un framework che permette di eseguire modelli di intelligenza artificiale avanzati (come Llama, Qwen, ecc.) direttamente sul tuo computer, senza bisogno di servizi cloud esterni.

## Vantaggi dell'AI Integrata

Con Ollama attivo, Studio 3D può:

- ✨ **Riconoscere automaticamente** soggetti e oggetti nelle immagini
- 🎯 **Identificare personaggi** e separarli dallo sfondo
- 🎨 **Rimuovere lo sfondo** automaticamente per conversioni 3D pulite
- 💡 **Suggerire configurazioni ottimali** (profondità, luci, materiali)
- 🧠 **Analizzare il contenuto** e fornire descrizioni dettagliate
- ⚡ **Tutto offline e privato** - nessun dato inviato online

## Installazione

### 1. Installa Ollama

#### Su Mac:
```bash
# Scarica e installa Ollama
curl https://ollama.ai/install.sh | sh

# Oppure usa Homebrew
brew install ollama
```

#### Su Linux:
```bash
curl https://ollama.ai/install.sh | sh
```

#### Su Windows:
Scarica l'installer da: https://ollama.ai/download

### 2. Avvia Ollama

Dopo l'installazione, avvia il servizio Ollama:

```bash
ollama serve
```

Questo avvierà Ollama in background su `http://localhost:11434`

### 3. Scarica un Modello Vision

Per l'analisi di immagini, hai bisogno di un modello "vision". Ecco le opzioni consigliate:

#### Opzione 1: Llama 3.2 Vision (Consigliato per Mac con Apple Silicon)
```bash
ollama pull llama3.2-vision
```
- **Dimensione**: ~7GB
- **Requisiti**: 8GB RAM
- **Ottimo per**: Analisi generale di immagini, riconoscimento oggetti

#### Opzione 2: Qwen2-VL (Migliore accuratezza)
```bash
ollama pull qwen2-vl
```
- **Dimensione**: ~4GB
- **Requisiti**: 8GB RAM
- **Ottimo per**: Analisi dettagliata, riconoscimento preciso di soggetti

#### Opzione 3: BakLLaVA (Più leggero)
```bash
ollama pull bakllava
```
- **Dimensione**: ~4GB
- **Requisiti**: 4GB RAM
- **Ottimo per**: Computer con meno RAM

### 4. Verifica l'Installazione

Verifica che tutto funzioni:

```bash
# Lista i modelli installati
ollama list

# Testa un modello
ollama run llama3.2-vision
```

## Utilizzo in Studio 3D

1. **Avvia Ollama** (se non già in esecuzione):
   ```bash
   ollama serve
   ```

2. **Apri Studio 3D** nel browser:
   ```
   npm run dev
   ```

3. **Verifica lo stato AI**:
   - Vedrai un badge verde "🧠 AI Ollama Attiva" se tutto funziona
   - Il numero di modelli installati sarà mostrato

4. **Usa la Conversione Intelligente**:
   - Carica un'immagine o video
   - Clicca sul pulsante **"✨ Conversione Intelligente"**
   - L'AI analizzerà automaticamente il contenuto
   - Vedrai i risultati: soggetto, descrizione, oggetti riconosciuti
   - Le configurazioni 3D saranno applicate automaticamente

## Modelli Consigliati per Uso Specifico

### Per Riconoscimento Persone/Volti:
```bash
ollama pull llama3.2-vision
```

### Per Analisi Oggetti/Prodotti:
```bash
ollama pull qwen2-vl
```

### Per Computer con Poca RAM (4GB):
```bash
ollama pull bakllava
```

## Risoluzione Problemi

### Ollama non si connette?

1. Verifica che Ollama sia in esecuzione:
   ```bash
   ps aux | grep ollama
   ```

2. Riavvia Ollama:
   ```bash
   killall ollama
   ollama serve
   ```

3. Controlla la porta:
   ```bash
   curl http://localhost:11434/api/tags
   ```

### Modello non funziona?

1. Verifica che sia scaricato:
   ```bash
   ollama list
   ```

2. Prova a scaricare nuovamente:
   ```bash
   ollama pull llama3.2-vision
   ```

### L'analisi è troppo lenta?

- Prova un modello più piccolo (bakllava)
- Assicurati di avere abbastanza RAM disponibile
- Su Mac: assicurati di usare la versione ottimizzata per Apple Silicon

## Requisiti di Sistema

### Minimi:
- **CPU**: Qualsiasi CPU moderna (x64 o ARM64)
- **RAM**: 4GB liberi
- **Spazio Disco**: 5GB per il modello

### Consigliati:
- **CPU**: Multi-core moderno (M1/M2/M3 su Mac, o CPU con AVX2)
- **RAM**: 8GB+ liberi
- **Spazio Disco**: 10GB+
- **GPU** (opzionale): NVIDIA con CUDA per accelerazione (Linux/Windows)

## Privacy e Sicurezza

✅ **Tutto locale**: Ollama esegue i modelli sul tuo computer
✅ **Nessun dato online**: Le tue immagini non lasciano mai il dispositivo
✅ **Open Source**: Codice completamente verificabile
✅ **Gratuito**: Nessun costo, nessun limite di utilizzo

## Modelli Alternativi

Puoi sperimentare con altri modelli vision disponibili su Ollama:

```bash
# Lista tutti i modelli vision disponibili
ollama search vision

# Altri modelli interessanti:
ollama pull llava                # Modello vision originale
ollama pull moondream           # Molto leggero (1.7GB)
ollama pull llama3.2-vision:90b # Massima accuratezza (richiede 64GB RAM!)
```

## Aggiornamenti

Per aggiornare Ollama e i modelli:

```bash
# Aggiorna Ollama
curl https://ollama.ai/install.sh | sh

# Aggiorna un modello
ollama pull llama3.2-vision
```

## Supporto

- **Documentazione Ollama**: https://ollama.ai/docs
- **Modelli disponibili**: https://ollama.ai/library
- **GitHub Issues**: https://github.com/ltoe68/3d/issues

## Contributi

Se hai suggerimenti per migliorare l'integrazione AI, apri una Issue o Pull Request!

---

**Fatto con ❤️ per Studio 3D Vitigni**
