<template>
  <div>
    <h2 class="mb-4">Nuova tessera</h2>

    <form @submit.prevent="saveCard" class="card">
      <div class="card-body">
        <div class="mb-3">
          <label class="form-label">Codice a barre</label>
          <div class="input-group">
            <input
              type="text"
              class="form-control"
              v-model="form.barcode"
              required
            >
            <button
              type="button"
              class="btn btn-outline-primary"
              @click="startScanner"
              title="Scansiona"
            >
              <i class="material-icons">qr_code_scanner</i>
            </button>
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label">Nome tessera</label>
          <input
            type="text"
            class="form-control"
            v-model="form.name"
            required
          >
        </div>

        <div class="mb-3">
          <label class="form-label">Categoria</label>
          <select class="form-select" v-model="form.category" required>
            <option value="">Seleziona una categoria</option>
            <option value="abbigliamento">Abbigliamento</option>
            <option value="vitto">Vitto</option>
            <option value="varie">Varie</option>
            <option value="tecnologia">Tecnologia</option>
          </select>
        </div>

        <div class="mb-3">
          <label class="form-label">Descrizione</label>
          <textarea
            class="form-control"
            v-model="form.description"
            rows="3"
          ></textarea>
        </div>

        <div class="d-flex justify-content-end gap-2">
          <router-link to="/cards" class="btn btn-secondary" title="Annulla">
            <i class="material-icons">close</i>
          </router-link>
          <button type="submit" class="btn btn-primary" title="Salva">
            <i class="material-icons">check</i>
          </button>
        </div>
      </div>
    </form>

    <!-- Scanner Modal -->
    <div class="modal fade" id="scannerModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Scansiona codice a barre</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              @click="stopScanner"
            ></button>
          </div>
          <div class="modal-body">
            <div id="reader" class="w-100"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCardsStore } from '../stores/cards'
import { Html5Qrcode } from 'html5-qrcode'
import { Modal } from 'bootstrap'

const router = useRouter()
const store = useCardsStore()
let scanner = null
let modal = null

const form = ref({
  barcode: '',
  name: '',
  category: '',
  description: ''
})

const startScanner = () => {
  modal = new Modal(document.getElementById('scannerModal'))
  modal.show()

  scanner = new Html5Qrcode('reader')
  scanner.start(
    { facingMode: 'environment' },
    {
      fps: 10,
      qrbox: { width: 400, height: 350 },
      formatsToSupport: ['QR_CODE', 'EAN_13', 'EAN_8', 'CODE_128', 'CODE_39']
    },
    onScanSuccess,
    onScanFailure
  )
}

const stopScanner = () => {
  if (scanner) {
    scanner.stop().then(() => {
      scanner = null
    })
  }
}

const onScanSuccess = (decodedText) => {
  form.value.barcode = decodedText
  stopScanner()
  modal.hide()
}

const onScanFailure = (error) => {
  console.warn(`Scan error: ${error}`)
}

const saveCard = () => {
  store.addCard(form.value)
  router.push('/cards')
}
</script>

<style scoped>
#reader {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}
</style> 