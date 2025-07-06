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

    <div v-if="card" class="card">n
      <div class="card-body">
        <div class="row">
          <div class="col-md-6">
            <h3 class="card-title">{{ card.name }}</h3>
            <p class="card-text">
              <strong>Categoria:</strong> {{ card.category }}<br>
              <strong>Descrizione:</strong> {{ card.description }}<br>
            </p>
          </div>
          <div class="col-md-6 text-center">
            <div class="mb-3">
              <h5>Codice a barre</h5>
              <div class="barcode-container">
                <img style="width: 100%;" :src="barcodeUrl" alt="Barcode" class="img-fluid">
              </div>
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

watch(card, { immediate: true })

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