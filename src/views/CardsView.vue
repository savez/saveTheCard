<template>
  <div class="container">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div class="d-flex gap-2">
        <button class="btn btn-primary btn-sm" @click="showUrlModal = true" title="Imposta link Google Sheets">
          <i class="material-icons">link</i>
        </button>
        <router-link to="/cards/new" class="btn btn-success btn-sm" title="Nuova tessera">
          <i class="material-icons me-1">add</i>
        </router-link>
      </div>
    </div>

    <!-- Modale per inserire/modificare il link -->
    <div class="modal fade" :class="{ show: showUrlModal }" tabindex="-1" style="display: block;" v-if="showUrlModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Imposta link Google Sheets</h5>
            <button type="button" class="btn-close" @click="showUrlModal = false"></button>
          </div>
          <div class="modal-body">
            <input type="text" class="form-control mb-2" v-model="driveUrlInput" placeholder="Link file Google Drive...">
            <button class="btn btn-primary w-100" @click="onSetDriveUrl">Salva link</button>
            <div v-if="statusMessage" :class="['alert',
              statusType === 'success' ? 'alert-success' : '',
              statusType === 'error' ? 'alert-danger' : '',
              statusType === 'info' ? 'alert-info' : '']" class="mt-2">
              {{ statusMessage }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showUrlModal" class="modal-backdrop fade show"></div>

    <div v-if="store.isLoading" class="alert alert-info mt-3">
      Caricamento tessere da Google Sheets...
    </div>
    <div v-else-if="!store.sheetUrl || store.cards.length === 0" class="alert alert-warning mt-3">
      Nessun file Drive impostato o nessuna tessera trovata. Inserisci il link al file Drive per caricare le tessere.
    </div>
    <div v-else>
      <div class="row">
        <div v-for="card in store.cards" :key="card.id" class="col-md-6 col-lg-4 mb-4">
          <div class="card h-100">
            <div class="card-body">
              <h5 class="card-title text-uppercase">{{ card.name }}</h5>
              <div class="mb-3">
                <div class="barcode-container text-center">
                  <img :src="getBarcodeUrl(card.barcode)" alt="Barcode" class="barcode-img" style="width: 100%;">
                  <br/><span class="text-muted">{{ card.barcode }}</span>
                </div>
              </div>
              <p class="card-text">
                <strong v-if="card.category">Categoria:</strong> {{ card.category }}<br>
                <strong v-if="card.description">Descrizione:</strong> {{ card.description }}
              </p>
            </div>
            <div class="card-footer bg-transparent">
              <div class="btn-group w-100">
                <router-link :to="`/cards/${card.id}`" class="btn btn-outline-primary" title="Dettagli">
                  <i class="material-icons">visibility</i>
                </router-link>
                <router-link :to="`/cards/${card.id}/edit`" class="btn btn-outline-warning" title="Modifica">
                  <i class="material-icons">edit</i>
                </router-link>
                <button @click="deleteCard(card.id)" class="btn btn-outline-danger" title="Elimina">
                  <i class="material-icons">delete</i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="filteredCards.length === 0 && !store.isLoading" class="text-center mt-4">
      <p class="lead">Nessuna tessera trovata</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCardsStore } from '../stores/cards'
import JsBarcode from 'jsbarcode'

const store = useCardsStore()
console.log('[DEBUG] store cards', store.cards);
const searchQuery = ref('')
const driveUrlInput = ref(localStorage.getItem('sheetUrl') || '')
const statusMessage = ref('')
const statusType = ref('') // 'success' | 'error' | 'info'
const showUrlModal = ref(false)

const filteredCards = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return store.cards.filter(card => 
    card.name.toLowerCase().includes(query) ||
    card.description.toLowerCase().includes(query)
  )
})

const deleteCard = (id) => {
  if (confirm('Sei sicuro di voler eliminare questa tessera?')) {
    store.deleteCard(id)
  }
}

function getBarcodeUrl(barcode) {
  if (!barcode) return ''
  const canvas = document.createElement('canvas')
  try {
    JsBarcode(canvas, barcode, {
      format: 'CODE128',
      width: 2,
      height: 40,
      displayValue: false
    })
    return canvas.toDataURL()
  } catch (e) {
    return ''
  }
}

function showStatus(msg, type = 'info', timeout = 2000) {
  statusMessage.value = msg
  statusType.value = type
  if (timeout) setTimeout(() => { statusMessage.value = '' }, timeout)
}

function onSetDriveUrl() {
  if (store.sheetUrl && typeof store.sheetUrl === 'object' && 'value' in store.sheetUrl) {
    store.sheetUrl.value = driveUrlInput.value
  } else {
    store.sheetUrl = driveUrlInput.value
  }
  localStorage.setItem('sheetUrl', driveUrlInput.value)
  showStatus('Link file Drive salvato!', 'success')
  showUrlModal.value = false
}

onMounted(async () => {
  // All'ingresso nella pagina, se esiste il link, carica le tessere da Drive
  if (localStorage.getItem('sheetUrl')) {
    store.sheetUrl.value = localStorage.getItem('sheetUrl')
    try {
      await store.loadFromDrive()
      showStatus('Tessere caricate da Google Drive!', 'success')
    } catch (e) {
      showStatus('Errore nel caricamento da Google Drive', 'error', 3000)
    }
  }
})
</script>

<style scoped>
.scanner-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.scanner-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.table td, .table th { vertical-align: middle; }

.barcode-container {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.barcode-img {
  max-width: 100%;
  max-height: 200px;
  margin-bottom: 0.5rem;
}

.modal {
  display: block;
  background: rgba(0,0,0,0.3);
  z-index: 2000;
}
.modal-backdrop {
  z-index: 1999;
}
</style>