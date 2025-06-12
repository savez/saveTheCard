# SaveTheCard

SaveTheCard è un'applicazione web per gestire le tessere fedeltà e sconto dei vari negozi. L'applicazione è stata sviluppata utilizzando Vue 3 e Bootstrap, con un focus particolare sulla user experience e la facilità d'uso su dispositivi mobili.

## Funzionalità

- 📱 Interfaccia responsive ottimizzata per dispositivi mobili
- 📷 Scansione del codice a barre tramite fotocamera
- 💾 Salvataggio locale dei dati
- 📤 Esportazione dei dati in formato CSV
- 🔄 Condivisione delle tessere tramite QR Code
- 📥 Importazione delle tessere tramite QR Code
- ✏️ Modifica e cancellazione delle tessere
- 🔍 Visualizzazione del codice a barre
- 📋 Elenco delle tessere salvate
- ➕ Inserimento di nuove tessere

## Requisiti tecnici

- Node.js 16.x o superiore
- npm 7.x o superiore

## Installazione

1. Clona il repository:
```bash
git clone https://github.com/tuousername/save-the-card.git
cd save-the-card
```

2. Installa le dipendenze:
```bash
npm install
```

3. Avvia il server di sviluppo:
```bash
npm run dev
```

4. Apri il browser all'indirizzo indicato nel terminale (solitamente http://localhost:5173)

## Tecnologie utilizzate

- Vue 3
- Vue Router
- Pinia
- Bootstrap 5
- HTML5-QRCode
- JsBarcode
- QRCode

## Struttura del progetto

```
src/
├── assets/          # Risorse statiche
├── components/      # Componenti Vue
├── router/          # Configurazione del router
├── stores/          # Store Pinia
└── views/           # Viste dell'applicazione
```

## Licenza

MIT
