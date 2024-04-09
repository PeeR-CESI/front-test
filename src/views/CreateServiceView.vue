<template>
    <div>
      <h2>Créer mon service</h2>
      <form @submit.prevent="createService">
        <div>
          <label for="nom">Nom du service:</label>
          <input id="nom" v-model="nom" type="text" required>
        </div>
        <div>
          <label for="description">Description:</label>
          <textarea id="description" v-model="description" required></textarea>
        </div>
        <div>
          <label for="price">Prix:</label>
          <input id="price" v-model="price" type="text" required>
        </div>
        <button type="submit">Créer mon service</button>
      </form>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref } from 'vue';
  import router from "../router"; // Assurez-vous d'importer le routeur correctement
  
  export default defineComponent({
    name: 'CreateServicePage',
    setup() {
      const nom = ref('');
      const description = ref('');
      const price = ref('');
  
      const createService = async () => {
        try {
          const response = await fetch('http://peer.cesi/api/service/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              nom: nom.value,
              description: description.value,
              price: price.value,
            }),
          });
  
          if (!response.ok) {
            throw new Error(`Erreur ${response.status}`);
          }
  
          const serviceData = await response.json();
          console.log('Service créé avec succès:', serviceData);
          router.push('/some-success-page'); // Redirection vers une page de succès ou d'accueil
  
        } catch (error) {
          console.error('Erreur lors de la création du service:', error);
        }
      };
  
      return {
        nom,
        description,
        price,
        createService,
      };
    },
  });
  </script>
  
  <style scoped>
  /* Vos styles ici */
  </style>
  