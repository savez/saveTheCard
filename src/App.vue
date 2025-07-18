<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container">
      <router-link class="navbar-brand" to="/">SaveTheCard <small>{{ version }}</small></router-link>
     
      <div v-if="isLoggedIn" class="ms-auto">
        <span v-if="user && user.name" class="me-2">{{ user.name }}</span>
        <img v-if="user && user.picture" :src="user.picture" alt="User" style="width:32px; height:32px; border-radius:50%" />
      </div>
    </div>
  </nav>

  <main class="flex-grow-1">
    <div v-if="!isLoggedIn" class="ms-auto">
      <button class="btn btn-dark" @click="login">Login con Google</button>
    </div>
    
    <router-view v-else></router-view>
  </main>
</template>

<script setup>
import pkg from '../package.json';
import { computed } from 'vue';
import useAuth from './composables/useAuth';

const version = pkg.version;

const { token, login, user } = useAuth();
const isLoggedIn = computed(() => !!token.value);


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
