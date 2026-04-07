# ILOVEPIRRONS - Y2K Website

Un sito web completo ispirato all'estetica Y2K / early-internet (MySpace / Windows XP / pop-punk / cyber-girl / glitter / plaid background).

## 🎨 Caratteristiche

- **6 Pagine Principali:**
  - Home: Hero section con finestre Windows XP, box "Before you follow", quick links
  - Blog: Feed cronologico con finestre stile OS
  - Live: Stream live, eventi passati e futuri con countdown
  - Download: Player audio old-school e lista canzoni scaricabili
  - Merch: Griglia prodotti con hover effects glitch/glow
  - Discografia: Sistema di annotazioni stile Genius.com con testo sincronizzato

- **Stile Visivo Y2K:**
  - Background plaid rosa-azzurro
  - Finestre stile Windows XP / Internet Explorer
  - Font pixel/bitmap
  - Media player old-style
  - Pulsanti glossy
  - Palette colori: rosa, azzurro, nero, bianco, accenti neon

## 📁 Struttura Progetto

```
sito pirrons/
├── index.html              # Home page
├── blog.html               # Blog page
├── live.html               # Live page
├── download.html           # Download page
├── merch.html              # Merch page
├── discografia.html        # Discografia page (Genius-style)
├── styles/
│   ├── global.css          # Stili globali Y2K
│   ├── home.css            # Stili pagina Home
│   ├── blog.css            # Stili pagina Blog
│   ├── live.css            # Stili pagina Live
│   ├── download.css        # Stili pagina Download
│   ├── merch.css           # Stili pagina Merch
│   └── discografia.css     # Stili pagina Discografia
├── js/
│   ├── navigation.js       # Navigazione e active states
│   ├── windows.js          # Funzionalità finestre draggable
│   ├── blog.js             # Caricamento e rendering blog posts
│   ├── live.js             # Eventi e countdown
│   ├── download.js         # Player audio e download
│   ├── merch.js            # Carrello e prodotti
│   └── discografia.js      # Sistema annotazioni Genius-style
├── data/
│   ├── blog-posts.json     # Dati mock blog
│   ├── events.json         # Dati mock eventi
│   ├── songs.json          # Dati mock canzoni
│   ├── merch.json          # Dati mock prodotti
│   └── discografia.json    # Dati mock album e annotazioni
└── assets/
    └── common/             # Immagini comuni (custom arrow.png, etc.)
```

## 🚀 Come Usare

1. Apri il file `index.html` in un browser moderno
2. Naviga tra le pagine usando il menu di navigazione
3. Interagisci con gli elementi:
   - Trascina le finestre Windows XP nella Home
   - Clicca sulle canzoni nella Discografia per vedere le annotazioni
   - Aggiungi prodotti al carrello nella pagina Merch
   - Usa il player audio nella pagina Download

## 🎯 Funzionalità Principali

### Home
- Finestre Windows XP draggable
- Box "Before you follow" / "Do not follow if"
- Quick links alle altre pagine

### Blog
- Feed cronologico di post
- Supporto immagini e tag
- Stile finestre OS

### Live
- Sezione live stream (placeholder)
- Eventi futuri con countdown
- Eventi passati

### Download
- Player audio old-school stile Windows Media Player
- Lista canzoni con azioni: Play, Download, Lyrics, Rate, Comment
- Equalizer animato

### Merch
- Griglia prodotti responsive
- Carrello con localStorage
- Hover effects glitch/glow

### Discografia (Genius-Style)
- Lista album → tracce
- Click su canzone → pagina dedicata
- Testo sincronizzato con annotazioni cliccabili
- Sidebar con: About, Fun Facts, Credits
- Popup annotazioni al click

## 🛠️ Tecnologie

- HTML5
- CSS3 (con animazioni e gradienti)
- JavaScript Vanilla (ES6+)
- JSON per dati mock
- Font Google: Press Start 2P, VT323

## 📝 Note

- I dati sono mock (JSON) - facilmente sostituibili con un backend
- Le immagini sono placeholder - aggiungi le tue in `assets/`
- Il player audio è simulato - per funzionalità reale, integra un player audio
- Il carrello usa localStorage - i dati persistono tra le sessioni

## 🎨 Personalizzazione

Per personalizzare:
1. Modifica i colori in `styles/global.css` (variabili CSS)
2. Aggiungi le tue immagini in `assets/common/`
3. Aggiorna i dati mock nei file JSON in `data/`
4. Personalizza i font modificando gli import in `global.css`

## 📱 Responsive

Il sito è responsive e si adatta a schermi mobile, tablet e desktop.

---

**Built with Y2K vibes ✨**

# ilovepirrons.com
