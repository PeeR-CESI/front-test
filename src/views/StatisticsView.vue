<template>
    <div class="statistics-container">
      <h1>Statistiques Globales</h1>
      <div v-if="loading">
        <p>Chargement des statistiques...</p>
      </div>
      <div v-else>
        <div class="statistic-box">
          <h2>Utilisateurs</h2>
          <p>{{ userCount }}</p>
        </div>
        <div class="statistic-box">
          <h2>Services</h2>
          <p>{{ serviceCount }}</p>
        </div>
        <div class="statistic-box">
          <h2>Prestations Vendues</h2>
          <p>{{ soldServiceCount }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';
  
  export default defineComponent({
    name: 'StatisticsView',
    setup() {
      const userCount = ref(0);
      const serviceCount = ref(0);
      const soldServiceCount = ref(0);
      const loading = ref(true);
  
      const fetchStatistics = async () => {
        try {
          const userResponse = await fetch('http://peer.cesi/api/user/all');
          const serviceResponse = await fetch('http://peer.cesi/api/service/all');
          const soldServiceResponse = await fetch('http://peer.cesi/api/service/sell/all');
  
          const users = await userResponse.json();
          const services = await serviceResponse.json();
          const soldServices = await soldServiceResponse.json();
  
          userCount.value = users.length;
          serviceCount.value = services.length;
          soldServiceCount.value = soldServices.length;
        } catch (error) {
          console.error('Erreur lors de la récupération des statistiques:', error);
        } finally {
          loading.value = false;
        }
      };
  
      onMounted(fetchStatistics);
  
      return {
        userCount,
        serviceCount,
        soldServiceCount,
        loading,
      };
    },
  });
  </script>
  
  <style scoped>
  .statistics-container {
    max-width: 600px;
    margin: 20px auto;
    text-align: center;
  }
  
  .statistic-box {
    margin: 20px 0;
    padding: 20px;
    background-color: #f2f2f2;
    border-radius: 8px;
  }
  
  h1, h2 {
    color: #333;
  }
  
  p {
    color: #666;
    font-size: 1.5rem;
  }
  </style>
  