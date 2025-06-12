<template>
  <div class="container">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Le mie tessere</h2>
      <div>
        <button class="btn btn-success me-2" @click="exportToCSV" title="Esporta CSV">
          <i class="material-icons">download</i>
        </button>
        <router-link to="/cards/new" class="btn btn-primary" title="Nuova tessera">
          <i class="material-icons">add</i>
        </router-link>
      </div>
    </div>

    <div class="mb-3">
      <input
        type="text"
        class="form-control"
        v-model="searchQuery"
        placeholder="Cerca per nome o descrizione o categoia ..."
      >
    </div>

    <div class="row">
      <div v-for="card in filteredCards" :key="card.id" class="col-md-6 col-lg-12 mb-4">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title text-uppercase">{{ card.name }}</h5>
            <div class="mb-3">
              <div class="barcode-container">
                <img style="width: 100%;" :src="getBarcodeUrl(card.barcode)" alt="Barcode" class="img-fluid">
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

    <div v-if="filteredCards.length === 0" class="text-center mt-4">
      <p class="lead">Nessuna tessera trovata</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCardsStore } from '../stores/cards'
import JsBarcode from 'jsbarcode'

const store = useCardsStore()
const searchQuery = ref('')

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
      height: 100,
      displayValue: true
    })
    return canvas.toDataURL()
  } catch (e) {
    return ''
  }
}

const exportToCSV = () => {
  store.exportToCSV()
}
</script>