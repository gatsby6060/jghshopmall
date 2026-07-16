<script setup lang="ts">
import { useCounterStore } from '../store/counter'
import { storeToRefs } from 'pinia'

const counterStore = useCounterStore()
const { count } = storeToRefs(counterStore)
const { increment } = counterStore
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Vue.js + Pinia + Tailwind</h1>
    <div class="mb-4">
      <p class="text-lg">Counter: <span class="font-bold text-blue-600">{{ count }}</span></p>
    </div>
    <button 
      @click="increment" 
      class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors cursor-pointer"
    >
      Increment
    </button>
  </div>
</template>
