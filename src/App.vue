<template>
  <div id="app">
    <!-- Afficher la barre de navigation seulement si l'utilisateur n'est pas sur les pages login ou register -->
    <NavigationBar v-if="!hideNavBar" />
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useRoute } from 'vue-router';
import NavigationBar from './views/NavigationBar.vue';

export default defineComponent({
  name: 'App',
  components: {
    NavigationBar,
  },
  setup() {
    const route = useRoute();
    const hideNavBar = computed(() => {
      const noNavBarRoutes: string[] = ['Login', 'Register'];
      const routeName = (typeof route.name === 'string' || typeof route.name === 'symbol') ? route.name.toString() : '';
      return noNavBarRoutes.includes(routeName);
    });

    return {
      hideNavBar,
    };
  },
});
</script>
