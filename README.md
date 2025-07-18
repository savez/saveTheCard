# SaveTheCard

SaveTheCard è un'applicazione web per gestire le tessere fedeltà e sconto dei vari negozi, con salvataggio sicuro su Google Sheets. L'applicazione è sviluppata in Vue 3 e Bootstrap, ottimizzata per dispositivi mobili e per la privacy dell'utente.

## Funzionalità principali

- 🔐 **Login obbligatorio con Google** (bloccante: senza login non puoi accedere all'app)
- ☁️ **Tutte le tessere sono salvate e caricate da un file Google Sheets** (impostabile dall'utente)
- 🗂️ **Visualizzazione tessere come card** con barcode grande e dettagli
- 🔎 **Barra di ricerca** per filtrare rapidamente le tessere per nome o descrizione
- ➕ **Aggiunta, modifica, eliminazione tessere** direttamente su Google Sheets
- 🎨 **(Opzionale) Card colorate in base alla categoria**
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
   - Copia il Client ID e inseriscilo come variabile d'ambiente `VITE_GOOGLE_CLIENT_ID` in un file `.env` nella root del progetto:

```env
VITE_GOOGLE_CLIENT_ID=il_tuo_client_id_google
```
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

## Flusso di autenticazione e protezione delle rotte

- **Login bloccante:**
  - All'apertura dell'app, se non sei autenticato, verrai reindirizzato automaticamente alla pagina `/login`.
  - La pagina `/login` mostra solo il bottone "Login con Google". Finché non effettui il login, non puoi accedere ad alcuna funzionalità dell'app.
  - Dopo il login, verrai reindirizzato alla home (`/`) e potrai usare tutte le funzionalità.
  - Se provi ad accedere a `/login` mentre sei già autenticato, verrai riportato alla home.
- **Tutte le rotte sono protette** tramite un global guard del router: senza token Google non puoi navigare l'app.

## Utilizzo

- **Login:** all'apertura dell'app viene richiesto il login Google tramite una pagina dedicata e bloccante
- **Imposta il link del file Google Sheets** tramite il bottone "link" in alto a destra
- **Aggiungi/modifica/elimina tessere:** tutte le operazioni aggiornano direttamente il file Google Sheets
- **Barra di ricerca:** cerca rapidamente le tessere per nome o descrizione tramite la barra sotto i bottoni
- **Bottoni azione:** i bottoni per aggiungere una nuova tessera o impostare il link sono piccoli e posizionati in alto a destra
- **(Opzionale) Card colorate:** puoi personalizzare lo sfondo delle card in base alla categoria (vedi codice per dettagli)
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

## Note sulle rotte

- `/` (home): mostra la lista delle tessere
- `/login`: pagina di login Google (bloccante)
- `/card/:id`: visualizza i dettagli di una tessera specifica
- `/card/:id/edit`: modifica una tessera esistente
- `/card/new`: crea una nuova tessera

## Demo

Puoi provare l'applicazione online all'indirizzo: [SaveTheCard Demo](https://savez.github.io/saveTheCard)

## Licenza

Questo progetto è rilasciato sotto licenza MIT. Vedi il file [LICENSE](LICENSE) per maggiori dettagli.

## Contribuire

I contributi sono sempre benvenuti! Se vuoi contribuire:

1. Fai un fork del repository
2. Crea un branch per la tua feature (`git checkout -b feature/NuovaFeature`)
3. Committa i tuoi cambiamenti (`git commit -m 'Aggiungi NuovaFeature'`)
4. Pusha sul branch (`git push origin feature/NuovaFeature`)
5. Apri una Pull Request
