<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container">
      <router-link class="navbar-brand" to="/">SaveTheCard <small>{{ version }}</small></router-link>
    </div>
  </nav>

  <main class="flex-grow-1">
    <router-view></router-view>
  </main>
</template>

<script setup>
import pkg from '../package.json';

const version = pkg.version;
</script>

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
