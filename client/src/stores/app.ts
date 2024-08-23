import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAppStore = defineStore('app', () => {
  const pageHeader = ref<string>('');

  return {
    pageHeader,
  };
});
