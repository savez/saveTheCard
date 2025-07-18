import { defineStore } from "pinia";
import { ref, watch } from "vue";
import useAuth from '../composables/useAuth';

export const useCardsStore = defineStore("cards", () => {
 const cards = ref([]);
 const isLoading = ref(true);
 const { createOrUpdateFile, loadFileContent, sheetUrl, setSheetUrl, loadGapi } = useAuth();

 function getFileIdFromUrl(url) {
  // Estrae l'ID dal link Google Drive (https://drive.google.com/file/d/FILE_ID/view)
  const match = url.match(/\/d\/([\w-]+)/);
  return match ? match[1] : null;
 }

 async function saveToDrive() {
  // Salva sempre su Google Sheets tramite API
  const url = sheetUrl.value || localStorage.getItem('sheetUrl');
  console.log('[DEBUG] sheetUrl usato:', url);
  const match = url.match(/\/d\/([\w-]+)/);
  const sheetId = match ? match[1] : null;
  console.log('[DEBUG] sheetId estratto:', sheetId);
  if (!sheetId) {
    if (typeof window !== 'undefined') alert('ID file Google Sheets non valido!');
    return;
  }
  await loadGapi();
  window.gapi.client.setToken({ access_token: useAuth().token.value });
  const headers = ["id", "name", "barcode", "category", "description", "createdAt"];
  const values = [
    headers,
    ...cards.value.map(card => headers.map(h => card[h] || ""))
  ];
  console.log('[DEBUG] values da salvare su Sheets:', values);
  try {
    await window.gapi.client.sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: 'A1:F1000',
      valueInputOption: 'RAW',
      resource: { values }
    });
  } catch (e) {
    console.error('Errore salvataggio su Google Sheets:', e);
    let errorMsg = '';
    if (typeof e === 'string') {
      errorMsg = e;
    } else if (e && typeof e.message === 'string') {
      errorMsg = e.message;
    } else if (e && e.error && typeof e.error.message === 'string') {
      errorMsg = e.error.message;
    } else {
      errorMsg = JSON.stringify(e);
    }
    if (typeof window !== 'undefined') alert('Errore nel salvataggio su Google Sheets: ' + errorMsg);
  }
 }

 async function updateDriveFileAsCSV(fileId, csvContent) {
  await loadGapi();
  window.gapi.client.setToken({ access_token: useAuth().token.value });
  return window.gapi.client.request({
    path: `/upload/drive/v3/files/${fileId}`,
    method: 'PATCH',
    params: { uploadType: 'media' },
    headers: { 'Content-Type': 'text/csv' },
    body: csvContent,
  });
 }

 async function loadFromDrive() {
  console.log('[DEBUG] loadFromDrive')
  isLoading.value = true;
  // Recupera i dati da Google Sheets (Excel online)
  const url = sheetUrl.value || localStorage.getItem('sheetUrl');
  console.log('[DEBUG] sheetUrl usato:', url);
  const match = url.match(/\/d\/([\w-]+)/);
  const sheetId = match ? match[1] : null;
  console.log('[DEBUG] sheetId estratto:', sheetId);
  if (!sheetId) {
    if (typeof window !== 'undefined') alert('ID file Google Sheets non valido!');
    console.error('[DEBUG] ID file Google Sheets non valido!');
    isLoading.value = false;
    return;
  }
  await loadGapi();
  window.gapi.client.setToken({ access_token: useAuth().token.value });
  const range = 'A1:Z1000'; // puoi adattare il range se serve
  try {
    console.log('[DEBUG] Chiamata a gapi.client.sheets.spreadsheets.values.get', { spreadsheetId: sheetId, range });
    const res = await window.gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range,
    });
    console.log('[DEBUG] Risultato API Sheets:', res);
    const values = res.result.values;
    if (!values || values.length < 2) {
      console.log('[DEBUG] Nessun dato trovato nel file Sheets');
      cards.value = [];
      isLoading.value = false;
      return;
    }
    const headers = values[0];
    console.log('[DEBUG] Headers trovati:', headers);
    const importedCards = values.slice(1).map(row => {
      const card = {};
      headers.forEach((header, i) => {
        card[header] = row[i] || '';
      });
      card.id = Number(card.id) || Date.now() + Math.floor(Math.random() * 10000);
      return card;
    });
    console.log(`[DEBUG] Tessere importate n° ${importedCards.length}:`, importedCards);
    cards.value = importedCards;
    isLoading.value = false;
    return;
  } catch (e) {
    console.error('[DEBUG] Errore nel caricamento da Google Sheets:', e);
    let errorMsg = '';
    if (typeof e === 'string') {
      errorMsg = e;
    } else if (e && typeof e.message === 'string') {
      errorMsg = e.message;
    } else if (e && e.error && typeof e.error.message === 'string') {
      errorMsg = e.error.message;
    } else {
      errorMsg = JSON.stringify(e);
    }
    if (typeof window !== 'undefined') alert('Errore nel caricamento da Google Sheets: ' + errorMsg);
    cards.value = [];
    isLoading.value = false;
  }
 }

 function addCard(card) {
  cards.value.push({
   id: Date.now(),
   ...card,
   createdAt: new Date().toISOString(),
  });
  saveToDrive();
 }

 function updateCard(id, updatedCard) {
  const index = cards.value.findIndex((card) => card.id === id);
  if (index !== -1) {
   cards.value[index] = { ...cards.value[index], ...updatedCard };
   saveToDrive();
  }
 }

 function deleteCard(id) {
  cards.value = cards.value.filter((card) => card.id !== id);
  saveToDrive();
 }

 function getCard(id) {
  return cards.value.find((card) => card.id === id);
 }

 function exportToCSV() {
  const headers = [
   "id",
   "name",
   "barcode",
   "category",
   "description",
   "createdAt",
  ];
  const csvContent = [
   headers.join(","),
   ...cards.value.map((card) =>
    headers.map((header) => card[header]).join(",")
   ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `loyalty-cards-${new Date().toISOString()}.csv`;
  link.click();
 }

 function importFromCSV(file) {
  const reader = new FileReader();
  reader.onload = function (e) {
    const text = e.target.result;
    const lines = text.split('\n').filter(Boolean);
    const headers = lines[0].split(',');
    const importedCards = lines.slice(1).map(line => {
      const values = line.split(',');
      const card = {};
      headers.forEach((header, i) => {
        card[header] = values[i];
      });
      card.id = Number(card.id) || Date.now() + Math.floor(Math.random() * 10000);
      return card;
    });
    // Sostituisci tutte le tessere con quelle importate
    cards.value = importedCards;
    saveToDrive();
  };
  reader.readAsText(file);
 }

 // Carica le tessere da Drive all'inizializzazione
 if (sheetUrl.value) {
   loadFromDrive();
 }

 // Ricarica le tessere ogni volta che sheetUrl cambia
 watch(sheetUrl, (newUrl) => {
   if (newUrl) {
     localStorage.setItem('sheetUrl', newUrl);
     loadFromDrive();
   }
 });

 return {
  cards,
  isLoading,
  addCard,
  updateCard,
  deleteCard,
  getCard,
  exportToCSV,
  importFromCSV,
  saveToDrive,
  loadFromDrive,
  sheetUrl,
 };
});
