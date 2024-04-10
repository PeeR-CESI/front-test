<template>
    <div class="modify-service">
      <h2>Modifier le Service</h2>
      <form @submit.prevent="updateService">
        <div>
          <label for="nom">Nom du service:</label>
          <input id="nom" v-model="nom" type="text" required>
        </div>
        <div>
          <label for="description">Description:</label>
          <textarea id="description" v-model="description" required></textarea>
        </div>
        <button type="submit">Mettre à jour le service</button>
      </form>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  
  export default defineComponent({
    setup() {
      const nom = ref('');
      const description = ref('');
      const route = useRoute();
      const router = useRouter();
      const serviceId = route.params.service_id;
  
      const fetchServiceDetails = async () => {
        const response = await fetch(`http://peer.cesi/api/service/${serviceId}`);
        if (response.ok) {
          const data = await response.json();
          nom.value = data.nom;
          description.value = data.description;
        } else {
          console.error('Erreur lors de la récupération du service');
        }
      };
  
      const updateService = async () => {
        try {
          const response = await fetch(`http://peer.cesi/api/service/update/${serviceId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              nom: nom.value,
              description: description.value,
            }),
          });
  
          if (!response.ok) {
            throw new Error(`Erreur lors de la mise à jour du service: ${response.status}`);
          }
  
          alert('Service mis à jour avec succès!');
          router.push(`/service/${serviceId}`);
        } catch (error) {
          if (error instanceof Error) {
            console.error('Erreur lors de la mise à jour du service:', error.message);
            alert(`Erreur lors de la mise à jour du service: ${error.message}`);
          }
        }
      };
  
      onMounted(fetchServiceDetails);
  
      return {
        nom,
        description,
        updateService,
      };
    },
  });
  </script>
  
  <style scoped>
  .modify-service {
    max-width: 500px;
    margin: 0 auto;
    padding: 20px;
  }
  
  form {
    display: flex;
    flex-direction: column;
  }
  
  form > div {
    margin-bottom: 20px;
  }
  
  label {
    margin-bottom: 5px;
    display: block;
  }
  
  input[type="text"],
  textarea {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  button {
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  </style>
  