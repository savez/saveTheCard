<script setup>
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">SaveTheCard</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link class="nav-link" to="/">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/cards">Le mie tessere</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/cards/new">Nuova tessera</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>

  <main class="flex-grow-1">
    <router-view></router-view>
  </main>
</template>

<style>
body {
  background-color: var(--bg-primary);
  margin: 0;
  min-height: 100vh;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
}

main {
  flex: 1;
  padding: 1rem;
  width: 100%;
}

.navbar {
  width: 100%;
}

.container-fluid {
  padding-left: 1rem;
  padding-right: 1rem;
}
</style>
