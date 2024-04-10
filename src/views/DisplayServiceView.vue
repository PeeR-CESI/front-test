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

interface Service {
  nom: string;
  description: string;
  price: string;
  presta_id: string;
}

export default defineComponent({
  name: 'DisplayServiceView',
  props: {
      service_id: String // Ajoutez cette ligne pour déclarer service_id comme prop
  },
  setup(props) {
    const service: Ref<Service | null> = ref(null);
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
        console.error('Erreur lors de la récupération du service:', error instanceof Error ? error.message : error);
        service.value = null; // En cas d'erreur, réinitialiser 'service' pour indiquer une erreur de chargement
      }
    };
  
    const buyService = async () => {
      if (!service.value) return;
      const serviceId = route.params.service_id;
      const userId = localStorage.getItem('user_id'); // Assurez-vous que l'ID utilisateur est correctement stocké lors de la connexion
      try {
          // 1. Vendre le service
          const sellResponse = await fetch('http://peer.cesi/api/service/sell/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ advancement: 0, service_id: serviceId }),
          });

          if (!sellResponse.ok) throw new Error('Problème lors de la vente du service.');
          const { sold_service_id } = await sellResponse.json();
            
          // 2. Récupérer les infos de l'utilisateur (demandeur)
          const userResponse = await fetch(`http://peer.cesi/api/user/find/${userId}`);
          if (!userResponse.ok) throw new Error('Problème lors de la récupération des infos utilisateur.');
          const userInfo = await userResponse.json();

          // 3. Mettre à jour les infos de l'utilisateur (demandeur) avec le nouveau sold_service_id
          const updatedSoldServiceIds = userInfo.sold_service_ids ? [...userInfo.sold_service_ids, sold_service_id] : [sold_service_id];
          await fetch(`http://peer.cesi/api/user/update/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...userInfo, sold_service_ids: updatedSoldServiceIds }),
          });

          // 4. Mettre à jour le prestataire avec le nouveau sold_service_id
          if (service.value && service.value.presta_id) {
              const prestaId = service.value.presta_id; // ID du prestataire
              const prestaResponse = await fetch(`http://peer.cesi/api/user/find/${prestaId}`);
              if (!prestaResponse.ok) throw new Error('Problème lors de la récupération des infos du prestataire.');
              const prestaInfo = await prestaResponse.json();

              const updatedPrestaSoldServiceIds = prestaInfo.sold_service_ids ? [...prestaInfo.sold_service_ids, sold_service_id] : [sold_service_id];
              await fetch(`http://peer.cesi/api/user/update/${prestaId}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ ...prestaInfo, sold_service_ids: updatedPrestaSoldServiceIds }),
              });
            }

          alert('Service acheté avec succès!');
        } catch (error) {
          alert('Erreur lors de l\'achat du service: ' + error.message);
        }
    };

      onMounted(fetchServiceDetails);

    return {
      service,
      buyService, // Assurez-vous d'ajouter cette nouvelle méthode
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
  
