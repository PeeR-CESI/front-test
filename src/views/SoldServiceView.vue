<template>
  <div>
    <h2>Services Vendus</h2>
    <div v-if="loading">Chargement des services...</div>
    <div v-else-if="errorMessage">
      <p>{{ errorMessage }}</p>
    </div>
    <div v-else-if="soldServices.length">
      <ul>
        <li v-for="soldService in soldServices" :key="soldService._id">
          <p><strong>Nom du Service:</strong> {{ soldService.nom }}</p>
          <p><strong>Description:</strong> {{ soldService.description }}</p>
          <p><strong>Prix:</strong> {{ soldService.price }}</p>
          <p><strong>Avancement:</strong> {{ soldService.advancement }}%</p>
          <p><strong>ID du Service Vendu:</strong> {{ soldService._id }}</p>
          <!-- Ajoutez d'autres détails ici si nécessaire -->
        </li>
      </ul>
    </div>
    <div v-else>
      <p>Aucun service vendu trouvé.</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import router from "../router";

interface ServiceSold {
  _id: string;
  nom: string;
  description: string;
  price: number;
  advancement: number;
}

export default defineComponent({
  name: 'SoldServicesView',
  setup() {
    const soldServices = ref<ServiceSold[]>([]);
    const loading = ref(true);
    const errorMessage = ref('');

    onMounted(async () => {
      const prestaId = localStorage.getItem('presta_id'); // Assurez-vous que l'ID du presta est stocké correctement
      if (!prestaId) {
        errorMessage.value = "Vous n'êtes pas connecté ou l'ID du presta n'est pas disponible.";
        loading.value = false;
        router.push('/login');
        return;
      }

      try {
        // Récupérer les infos du presta pour obtenir les ID des services vendus
        const prestaResponse = await fetch(`http://peer.cesi/api/user/find/${prestaId}`);
        if (!prestaResponse.ok) throw new Error('Problème lors de la récupération des infos du prestataire.');
        const prestaData = await prestaResponse.json();

        const soldServiceIds = prestaData.sold_service_ids;
        for (const soldServiceId of soldServiceIds) {
          const serviceResponse = await fetch(`http://peer.cesi/api/service/sell/${soldServiceId}`);
          if (!serviceResponse.ok) throw new Error('Problème lors de la récupération des détails du service vendu.');
          const serviceData = await serviceResponse.json();
          soldServices.value.push(serviceData);
        }
      } catch (error) {
          errorMessage.value = 'Erreur lors de la récupération des services vendus: ' + error.message;
      } finally {
          loading.value = false;
      }
    });

    return { soldServices, loading, errorMessage };
  },
});
</script>

<style scoped>
/* Ajoutez votre CSS ici pour styler la vue des services vendus */
</style>