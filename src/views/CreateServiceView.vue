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

        const result = await response.json();
        if (response.status === 201) {
          console.log('Service créé avec succès:', result);
          window.alert(result.message); // Affiche le message de succès
          // Stockez le service_id comme souhaité ici. Par exemple, redirigez vers une nouvelle URL contenant le service_id
          router.push(`/service/${result.service_id}`); // Redirige vers la page d'affichage des détails du service avec l'ID du service
        }




        } catch (error) {
        if (error instanceof Error) { // Vérifiez que l'erreur est une instance de Error
          console.error('Erreur lors de la création du service:', error.message);
          window.alert(`Erreur lors de la création du service: ${error.message}`);
        } else {
          console.error('Erreur inconnue lors de la création du service', error);
          window.alert('Erreur inconnue lors de la création du service');
        }
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
/* Styles conservés tels quels */
form {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  max-width: 400px;
  margin: 0 auto;
}

input[type="text"],
textarea,
select {
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  align-self: center;
}

button:hover {
  background-color: #0056b3;
}
</style>
