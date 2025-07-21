import { ref, computed } from "vue";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const SCOPES =
 "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file openid email profile";

const user = ref(null);
const token = ref(localStorage.getItem("google_token") || "");
const sheetUrl = ref(localStorage.getItem("sheetUrl") || "");
const refreshToken = ref(localStorage.getItem("google_refresh_token") || "");
let onRefreshUsed = null; // callback per notificare l'uso del refresh token

console.log('token ref', token.value);

let tokenClient = null;
let gapiLoaded = false;

function initGoogle() {
  console.log('initGoogle',{
    client_id: CLIENT_ID,
    scopes: SCOPES,
  });
 if (window.google && !tokenClient) {
  tokenClient = window.google.accounts.oauth2.initTokenClient({
   client_id: CLIENT_ID,
   scope: SCOPES,
   // AGGIUNTA: prompt e access_type per refresh token
   prompt: 'consent',
   access_type: 'offline',
   callback: (resp) => {
    if (resp.access_token) {
     token.value = resp.access_token;
     localStorage.setItem("google_token", resp.access_token);
     // Salva refresh token se presente
     if (resp.refresh_token) {
       refreshToken.value = resp.refresh_token;
       localStorage.setItem("google_refresh_token", resp.refresh_token);
     }
     fetchUserInfo();
    }
   },
  });
 }
}

function login() {
 initGoogle();
 if (tokenClient) tokenClient.requestAccessToken();
}

function logout() {
 token.value = "";
 user.value = null;
 localStorage.removeItem("google_token");
}

function fetchUserInfo() {
 if (!token.value) return;
 fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
  headers: { Authorization: `Bearer ${token.value}` },
 })
  .then((res) => res.json())
  .then((data) => {
   user.value = data;
  });
}

function setSheetUrl(url) {
 sheetUrl.value = url;
 localStorage.setItem("sheetUrl", url);
}

function clearSheetUrl() {
 sheetUrl.value = "";
 localStorage.removeItem("sheetUrl");
}

function loadGapi() {
  return new Promise((resolve, reject) => {
    if (gapiLoaded) return resolve(window.gapi);
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = () => {
      window.gapi.load('client', async () => {
        await window.gapi.client.init({
          apiKey: undefined, // non serve per Drive personale
          discoveryDocs: [
            'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
            'https://sheets.googleapis.com/$discovery/rest?version=v4'
          ],
        });
        gapiLoaded = true;
        resolve(window.gapi);
      });
    };
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

async function createOrUpdateFile(filename, content) {
  await loadGapi();
  window.gapi.client.setToken({ access_token: token.value });
  // Cerca se esiste già il file
  const q = `name='${filename}' and trashed=false`;
  const res = await window.gapi.client.drive.files.list({ q });
  let fileId = res.result.files && res.result.files[0]?.id;
  if (!fileId) {
    // Crea nuovo file
    const createRes = await window.gapi.client.drive.files.create({
      resource: {
        name: filename,
        mimeType: 'application/json',
      },
      fields: 'id',
    });
    fileId = createRes.result.id;
  }
  // Aggiorna contenuto file
  await window.gapi.client.request({
    path: `/upload/drive/v3/files/${fileId}`,
    method: 'PATCH',
    params: { uploadType: 'media' },
    body: content,
  });
  // Rendi il file accessibile solo all'utente
  const fileUrl = `https://drive.google.com/file/d/${fileId}/view`;
  setSheetUrl(fileUrl);
  return fileUrl;
}

async function loadFileContent(filename) {
  await loadGapi();
  window.gapi.client.setToken({ access_token: token.value });
  const q = `name='${filename}' and trashed=false`;
  const res = await window.gapi.client.drive.files.list({ q });
  const file = res.result.files && res.result.files[0];
  if (!file) return null;
  const fileId = file.id;
  const download = await window.gapi.client.drive.files.get({
    fileId,
    alt: 'media',
  });
  return download.body;
}

async function refreshAccessToken() {
  // Usa il refresh token per ottenere un nuovo access token
  if (!refreshToken.value) return false;
  try {
    const params = new URLSearchParams();
    params.append('client_id', CLIENT_ID);
    params.append('grant_type', 'refresh_token');
    params.append('refresh_token', refreshToken.value);
    const resp = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });
    const data = await resp.json();
    if (data.access_token) {
      token.value = data.access_token;
      localStorage.setItem("google_token", data.access_token);
      if (onRefreshUsed) onRefreshUsed();
      fetchUserInfo();
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
}

async function withTokenRetry(apiFn) {
  // Esegue una funzione che usa il token, se fallisce prova il refresh
  try {
    return await apiFn(token.value);
  } catch (e) {
    // Se errore di autenticazione, prova refresh
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return await apiFn(token.value);
    } else {
      // Se non c'è refresh token, forza login Google
      if (!refreshToken.value) {
        login();
        throw new Error('Token scaduto: login Google richiesta');
      }
      throw e;
    }
  }
}

if (token.value && !user.value) fetchUserInfo();

export default function useAuth() {
 return {
  user: computed(() => user.value),
  token: computed(() => token.value),
  sheetUrl,
  login,
  logout,
  setSheetUrl,
  clearSheetUrl,
  createOrUpdateFile,
  loadFileContent,
  loadGapi,
  refreshAccessToken,
  withTokenRetry,
  setOnRefreshUsed: (cb) => { onRefreshUsed = cb; },
 };
}
