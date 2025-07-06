# SaveTheCard

SaveTheCard è un'applicazione web per gestire le tessere fedeltà e sconto dei vari negozi, con salvataggio sicuro su Google Sheets. L'applicazione è sviluppata in Vue 3 e Bootstrap, ottimizzata per dispositivi mobili e per la privacy dell'utente.

## Funzionalità principali

- 🔐 **Login obbligatorio con Google**
- ☁️ **Tutte le tessere sono salvate e caricate da un file Google Sheets** (impostabile dall'utente)
- 🗂️ **Visualizzazione tessere come card** con barcode grande e dettagli
- ➕ **Aggiunta, modifica, eliminazione tessere** direttamente su Google Sheets
- 📝 **Campo per impostare/modificare il link del file Google Sheets** (in una modale)
- ✅ **Feedback visivo** per ogni operazione
- ❌ **Nessun salvataggio locale, nessun QR, nessuna esportazione/importazione CSV**

## Requisiti tecnici

- Node.js 16.x o superiore
- npm 7.x o superiore
- Un account Google
- Un progetto Google Cloud con OAuth 2.0 Client ID e API Drive + Sheets abilitate

## Setup Google Cloud (primo avvio)

1. **Crea un progetto su [Google Cloud Console](https://console.cloud.google.com/)**
2. **Abilita le API:**
   - Google Drive API
   - Google Sheets API
3. **Crea un OAuth 2.0 Client ID** (tipo Web):
   - Inserisci l'URL di origine (es: http://localhost:5173)
   - Copia il Client ID e inseriscilo nel codice (`useAuth.js`)
4. **Crea un file Google Sheets vuoto** nel tuo Drive e copia il link

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
4. Apri il browser all'indirizzo indicato nel terminale (es: http://localhost:5173)

## Utilizzo

- **Login:** all'apertura dell'app viene richiesto il login Google
- **Imposta il link del file Google Sheets** tramite il bottone "link" in alto a destra
- **Aggiungi/modifica/elimina tessere:** tutte le operazioni aggiornano direttamente il file Google Sheets
- **Le tessere sono mostrate come card, con barcode grande e dettagli**

## Tecnologie utilizzate

- Vue 3
- Vue Router
- Pinia
- Bootstrap 5
- Google Identity Services (GSI)
- Google Drive API
- Google Sheets API
- JsBarcode

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
