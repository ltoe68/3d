# 🎨 Studio 3D Vitigni - Setup sul Mac

## ✅ Codice Pushato su GitHub!

Il codice è stato caricato con successo su: **https://github.com/ltoe68/3d**

---

## 📦 Setup sul tuo Mac (5 minuti)

### 1️⃣ Clona il Repository

Apri il **Terminale** sul tuo Mac e esegui:

```bash
cd ~/Desktop
git clone https://github.com/ltoe68/3d.git
cd 3d
```

### 2️⃣ Installa le Dipendenze

```bash
npm install
```

Questo richiederà circa 2-3 minuti.

### 3️⃣ Avvia il Server

```bash
npm run dev
```

Vedrai un messaggio tipo:

```
VITE v7.2.2  ready in 300 ms

➜  Local:   http://localhost:5173/
➜  Network: http://192.168.x.x:5173/
```

### 4️⃣ Apri il Browser

Apri il tuo browser preferito e vai a:

```
http://localhost:5173/
```

Oppure usa direttamente la pagina di test:

```
http://localhost:5173/test.html
```

---

## 🎯 Cosa Vedrai

### Pagina Principale (`/`)
- Titolo: **🎨 Studio 3D Vitigni**
- Testo: "Test - Server funzionante!"

### Pagina Test (`/test.html`)
- Una bella pagina viola con gradiente
- Messaggio: "✅ SERVER FUNZIONANTE!"
- Orologio in tempo reale

---

## 📂 Struttura del Progetto

```
3d/
├── src/
│   ├── components/          # Componenti React
│   │   ├── ImageTo3D.tsx   # Conversione Immagine → 3D
│   │   ├── Model3DLoader.tsx # Caricamento modelli GLB/GLTF
│   │   ├── AudioPlayer.tsx  # Player musicale
│   │   ├── DialoguePlayer.tsx # Sistema Text-to-Speech
│   │   └── ui/             # Componenti UI (shadcn)
│   ├── types/              # TypeScript types
│   │   ├── vitigni.ts      # Definizioni personaggi vino
│   │   ├── scene-config.ts # Configurazione scene 3D
│   │   ├── audio-config.ts # Configurazione audio
│   │   └── unified-config.ts # Config unificata
│   ├── pages/
│   │   └── ImageTo3DPage.tsx # Pagina principale
│   └── main.tsx            # Entry point
├── public/
│   └── test.html           # Pagina di test
└── package.json            # Dipendenze

```

---

## 🛠️ Tecnologie Utilizzate

- **React 18** con TypeScript
- **Vite** - Build tool velocissimo
- **Three.js** - Rendering 3D
- **React Three Fiber** - Three.js per React
- **@react-three/drei** - Helper per R3F
- **TailwindCSS** - Styling
- **shadcn/ui** - Componenti UI
- **Lucide React** - Icone

---

## 🎨 Funzionalità Disponibili

### 🖼️ Image to 3D
Converte immagini in modelli 3D usando la luminosità come profondità

### 🎭 Caricamento Modelli 3D
Supporta file GLB e GLTF

### 🎬 Video Texture
Usa video MP4 come texture su superfici 3D

### 🎵 Sistema Audio
- Player musicale con controlli
- Text-to-Speech per dialoghi
- Sincronizzazione audio/video

### ⚙️ Editor Configurazione
Editor JSON per controllare scene, luci, materiali e audio

---

## 🐛 Troubleshooting

### Il server non si avvia
```bash
# Pulisci e reinstalla
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Porta già in uso
Se la porta 5173 è occupata, Vite ne userà automaticamente un'altra. Controlla il terminale per l'URL corretto.

### Errori TypeScript
Il progetto è configurato ma alcuni componenti potrebbero avere errori di tipo. Per ora puoi ignorarli - il server funziona comunque in modalità development.

---

## 📝 Note

- Il progetto è attualmente in modalità **development**
- Per la produzione, usa `npm run build`
- Il token GitHub che hai usato è salvato localmente - tienilo al sicuro!

---

## 🚀 Prossimi Passi

1. **Riattiva i componenti 3D completi** (attualmente semplificati per il test)
2. **Aggiungi i personaggi vitigni** con le loro animazioni
3. **Carica modelli 3D e video**
4. **Configura le scene** tramite l'editor JSON

---

**Buon divertimento con Studio 3D! 🎨✨**
