<template>
  <div class="login-container">
    <button class="btn btn-primary" @click="login">Login con Google</button>
  </div>
</template>

<script setup>
import useAuth from '../composables/useAuth';
const { login } = useAuth();
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}
</style> 