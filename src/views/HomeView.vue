<template>
  <div class="home">
    <h1>Bienvenue, {{ username }}</h1>
    <button @click="goToSettings">Paramètres</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'HomeView',
  setup() {
    const router = useRouter();
    const username = computed(() => localStorage.getItem('username'));

    const goToSettings = () => {
      router.push('/parameters');
    };

    return {
      username,
      goToSettings,
    };
  },
});
</script>

<style scoped>
/* Vos styles ici */
</style>
