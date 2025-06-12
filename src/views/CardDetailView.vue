<template>
  <div class="container">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Dettagli tessera</h2>
      <div>
        <router-link :to="`/cards/${card.id}/edit`" class="btn btn-primary me-2" title="Modifica">
          <i class="material-icons">edit</i>
        </router-link>
        <router-link to="/cards" class="btn btn-secondary" title="Indietro">
          <i class="material-icons">arrow_back</i>
        </router-link>
      </div>
    </div>

    <div v-if="card" class="card">
      <div class="card-body">
        <div class="row">
          <div class="col-md-6">
            <h3 class="card-title">{{ card.name }}</h3>
            <p class="card-text">
              <strong>Categoria:</strong> {{ card.category }}<br>
              <strong>Descrizione:</strong> {{ card.description }}<br>
              <strong>Codice a barre:</strong> {{ card.barcode }}
            </p>
          </div>
          <div class="col-md-6 text-center">
            <div class="mb-3">
              <h5>Codice a barre</h5>
              <div class="barcode-container">
                <img :src="barcodeUrl" alt="Barcode" class="img-fluid">
              </div>
            </div>
            <div>
              <h5>Condividi tessera</h5>
              <div class="qrcode-container">
                <img :src="qrCodeUrl" alt="QR Code" class="img-fluid">
              </div>
              <button class="btn btn-outline-primary mt-2" @click="downloadQRCode" title="Scarica QR Code">
                <i class="material-icons">download</i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="alert alert-warning">
      Tessera non trovata
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCardsStore } from '../stores/cards'
import JsBarcode from 'jsbarcode'
import QRCode from 'qrcode'

const route = useRoute()
const store = useCardsStore()

const card = computed(() => store.getCard(Number(route.params.id)))

const barcodeUrl = computed(() => {
  if (!card.value) return ''
  
  const canvas = document.createElement('canvas')
  JsBarcode(canvas, card.value.barcode, {
    format: 'CODE128',
    width: 2,
    height: 100,
    displayValue: true
  })
  return canvas.toDataURL()
})

const qrCodeUrl = ref('')

async function generateQRCode() {
  if (!card.value) {
    qrCodeUrl.value = ''
    return
  }
  const cardData = {
    id: card.value.id,
    name: card.value.name,
    barcode: card.value.barcode,
    category: card.value.category,
    description: card.value.description
  }
  qrCodeUrl.value = await QRCode.toDataURL(JSON.stringify(cardData))
}

onMounted(generateQRCode)
watch(card, generateQRCode, { immediate: true })

const downloadQRCode = async () => {
  if (!card.value) return
  
  const link = document.createElement('a')
  link.href = await qrCodeUrl.value
  link.download = `tessera-${card.value.name}.png`
  link.click()
}
</script>

<style scoped>
.barcode-container, .qrcode-container {
  background: white;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 1rem;
}

.barcode-container img, .qrcode-container img {
  max-width: 100%;
  height: auto;
}
</style>