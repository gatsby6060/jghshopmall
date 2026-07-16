import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { CartItem } from '../types';

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([]);

  function setItems(newItems: CartItem[]) {
    items.value = newItems;
  }

  function addItem(item: CartItem) {
    const existing = items.value.find((i) => i.productId === item.productId);
    if (existing) {
      existing.quantity = item.quantity;
    } else {
      items.value.push(item);
    }
  }

  function updateItem(id: number, quantity: number) {
    const item = items.value.find((i) => (i.id || i.productId) === id);
    if (item) {
      item.quantity = quantity;
    }
  }

  function removeItem(id: number) {
    items.value = items.value.filter((i) => (i.id || i.productId) !== id);
  }

  function clearCart() {
    items.value = [];
  }

  const totalCount = computed(() => {
    return items.value.reduce((sum, item) => sum + item.quantity, 0);
  });

  const totalPrice = computed(() => {
    return items.value.reduce((sum, item) => {
      const price = item.discountPrice ?? item.price;
      return sum + price * item.quantity;
    }, 0);
  });

  return {
    items,
    setItems,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    totalCount,
    totalPrice,
  };
}, {
  persist: true
});
