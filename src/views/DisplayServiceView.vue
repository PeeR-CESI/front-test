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
    <button v-if="service" @click="buyService">Acheter ce service</button>
  </template>
  
  <script lang="ts">
  import { defineComponent, onMounted, ref, Ref} from 'vue';
  import { useRoute } from 'vue-router';

  // Extend the Service interface to include presta_id
  interface Service {
    nom: string;
    description: string;
    price: string;
    presta_id?: string; // Make it optional if not all services have a prestataire ID
  }

  export default defineComponent({
    name: 'DisplayServiceView',
    setup() {
      const service: Ref<Service | null> = ref(null);
      const route = useRoute();
    
      const fetchServiceDetails = async () => {
        try {
          const serviceId = route.params.service_id;
          const response = await fetch(`http://peer.cesi/api/service/${serviceId}`);
    
          if (!response.ok) {
            throw new Error(`Erreur lors de la récupération du service: ${response.status}`);
          }
    
          const data = await response.json();
          service.value = data;
        } catch (error: unknown) { // Correctly handle the error of type unknown
          console.error(error);
          service.value = null;
          // Perform additional error handling here, if necessary
        }
      };
    
      const buyService = async () => {
        const serviceId = route.params.service_id;
        const userId = localStorage.getItem('user_id');
        
        try {
          const sellResponse = await fetch('http://peer.cesi/api/service/sell/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ advancement: 0, service_id: serviceId }),
          });

          if (!sellResponse.ok) throw new Error('Problème lors de la vente du service.');
          const { sold_service_id } = await sellResponse.json();
          
          // Additional code for updating user and prestataire information goes here

          alert('Service acheté avec succès!');
        } catch (error: unknown) { // Correctly handle the error of type unknown
          if (error instanceof Error) {
            alert(`Erreur lors de l'achat du service: ${error.message}`);
          } else {
            alert('Une erreur inconnue est survenue.');
          }
        }
      };

      onMounted(fetchServiceDetails);

      return {
        service,
        buyService,
      };
    },
  });
  </script>
  
  <style scoped>
  /* Conteneur principal pour assurer un espacement autour des bords */
  div {
    margin: 20px;
    font-family: 'Roboto', sans-serif;
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
