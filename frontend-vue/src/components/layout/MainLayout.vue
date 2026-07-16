<script setup lang="ts">
import AppHeader from './Header.vue'
import AppFooter from './Footer.vue'
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <AppHeader />
    <main class="flex-grow">
      <router-view />
    </main>
    <AppFooter />
  </div>
</template>
