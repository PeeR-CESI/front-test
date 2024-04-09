<template>
    <div v-if="service">
      <h2>Détails du Service</h2>
      <p><strong>Nom:</strong> {{ service.nom }}</p>
      <p><strong>Description:</strong> {{ service.description }}</p>
      <p><strong>Prix:</strong> {{ service.price }}</p>
    </div>
    <div v-else>
      <p>Chargement des détails du service ou service non trouvé...</p>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';
  import { useRoute } from 'vue-router';
  
  export default defineComponent({
    name: 'DisplayServiceView',
    setup() {
      const service = ref(null);
      const route = useRoute(); // Utilisez useRoute pour accéder aux paramètres de l'URL
  
      const fetchServiceDetails = async () => {
        try {
          const serviceId = route.params.service_id; // Récupère l'ID du service depuis l'URL
          const response = await fetch(`http://peer.cesi/api/service/${serviceId}`);
  
          if (!response.ok) {
            throw new Error(`Erreur lors de la récupération du service: ${response.status}`);
          }
  
          const data = await response.json();
          service.value = data; // Stockez les données du service récupéré dans la variable réactive 'service'
        } catch (error) {
          console.error(error);
          service.value = null; // En cas d'erreur, réinitialiser 'service' pour indiquer une erreur de chargement
        }
      };
  
      onMounted(fetchServiceDetails); // Exécute fetchServiceDetails lors du montage du composant
  
      return {
        service,
      };
    },
  });
  </script>
  
  <style scoped>
  /* Conteneur principal pour assurer un espacement autour des bords */
  div {
    margin: 20px;
    font-family: 'Arial', sans-serif;
  }
  
  /* Met en évidence le titre pour attirer l'attention */
  h2 {
    color: #333;
    margin-bottom: 20px;
  }
  
  /* Style pour les informations du service, avec un espacement uniforme */
  p {
    margin: 10px 0;
    line-height: 1.6;
    color: #555;
  }
  
  /* Met en valeur les éléments clés */
  strong {
    color: #000;
    font-weight: bold;
  }
  
  /* Style spécifique pour le message de chargement ou d'erreur */
  div:nth-child(2) p {
    color: #999;
    font-style: italic;
  }
  </style>
  