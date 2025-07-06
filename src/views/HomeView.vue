<template>
  <div class="text-center">
    <h1 class="display-4 mb-4">Benvenuto in SaveTheCard</h1>
    <p class="lead mb-4">Gestisci tutte le tessere fedeltà in un unico posto</p>
    
    <div class="row justify-content-center">
      <div class="col-md-4 mb-3">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Nuova tessera</h5>
            <p class="card-text">Aggiungi una nuova tessera fedeltà</p>
            <router-link to="/cards/new" class="btn btn-primary" title="Aggiungi">
              <i class="material-icons">add</i>
            </router-link>
          </div>
        </div>
      </div>
      
      <div class="col-md-4 mb-3">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Le mie tessere</h5>
            <p class="card-text">Visualizza e gestisci le tessere salvate</p>
            <router-link to="/cards" class="btn btn-primary" title="Visualizza">
              <i class="material-icons">list</i>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 