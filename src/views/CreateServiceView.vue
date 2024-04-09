<template>
    <div>
      <h2>Créer mon service</h2>
      <form @submit.prevent="createService">
        <div>
          <label for="nom">Nom du service:</label>
          <input id="nom" v-model="service.nom" type="text" required>
        </div>
        <div>
          <label for="description">Description:</label>
          <textarea id="description" v-model="service.description" required></textarea>
        </div>
        <div>
          <label for="price">Prix:</label>
          <input id="price" v-model="service.price" type="text" required>
        </div>
        <button type="submit">Créer mon service</button>
      </form>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref } from 'vue';
  
  export default defineComponent({
    name: 'CreateServicePage',
    setup() {
      const service = ref({
        nom: '',
        description: '',
        price: '',
      });
  
      const createService = async () => {
        try {
          const response = await fetch('http://peer.cesi/api/service/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(service.value),
          });
  
          if (response.ok) {
            // La requête a réussi, gérer la réponse de l'API ici, par exemple, afficher un message de succès ou rediriger l'utilisateur.
            console.log('Service créé avec succès');
          } else {
            // Gérez les erreurs HTTP ici
            console.error('Une erreur est survenue lors de la création du service');
          }
        } catch (err) {
          // Gérez les erreurs de réseau ou autres erreurs inattendues ici
          console.error('Erreur réseau ou inattendue:', err);
        }
      };
  
      return {
        service,
        createService,
      };
    },
  });
  </script>
  
  <style scoped>
  /* Vos styles ici */
  </style>
  