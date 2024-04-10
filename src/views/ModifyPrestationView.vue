/*
Vue "Modifier le Service" :
- Cette vue permet aux prestataires de modifier les informations d'un service qu'ils ont créé. Les champs modifiables incluent le nom du service et sa description.
- La vue récupère d'abord les détails actuels du service en utilisant l'ID du service passé en paramètre dans l'URL, permettant au prestataire de voir les informations existantes avant de les modifier.
- Après modification, un appel API est effectué pour mettre à jour les informations du service dans la base de données. Un message de succès ou d'erreur est affiché selon le résultat de l'opération.

Conditions préalables :
- L'utilisateur doit être connecté et posséder le rôle de "presta" ou "admin".
- L'utilisateur doit être le créateur du service qu'il souhaite modifier (cette vérification doit être effectuée côté serveur).

Fonctionnalités :
- Récupération et affichage des détails actuels du service pour modification.
- Validation des champs modifiés côté client avant envoi de la requête de mise à jour.
- Mise à jour des informations du service via une requête API PUT, avec gestion appropriée des réponses de succès et d'erreur.

Sécurité :
- Assurer que seul le créateur du service ou un administrateur peut modifier les informations du service.
- Valider côté serveur les données envoyées pour la mise à jour afin d'éviter les injections SQL ou XSS.

Résultat attendu :
- En cas de succès, le service est mis à jour dans la base de données, et l'utilisateur est redirigé vers la page de détails du service avec un message de confirmation.
- En cas d'échec (par exemple, validation des données côté serveur échouée, problème de réseau, etc.), un message d'erreur est affiché à l'utilisateur.
*/

<template>
  <div class="modify-prestation">
    <h2>Modifier la Prestation</h2>
    <form @submit.prevent="updatePrestation">
      <div>
        <label for="name">Nom de la prestation:</label>
        <input id="name" v-model="name" type="text" required>
      </div>
      <div>
        <label for="description">Description:</label>
        <textarea id="description" v-model="description" required></textarea>
      </div>
      <div>
        <label for="price">Prix:</label>
        <input id="price" v-model="price" type="number" required>
      </div>
      <div>
        <label for="status">Statut:</label>
        <select id="status" v-model="status" required>
          <option value="en attente">En attente</option>
          <option value="en cours">En cours</option>
          <option value="terminé">Terminé</option>
        </select>
      </div>
      <div>
        <label for="advancement">Avancement (%):</label>
        <input id="advancement" v-model="advancement" type="number" min="0" max="100" required>
      </div>
      <button type="submit">Mettre à jour la prestation</button>
    </form>
  </div>
</template>
  
<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default defineComponent({
  setup() {
    const name = ref('');
    const description = ref('');
    const price = ref(0);
    const status = ref('');
    const advancement = ref(0);
    const router = useRouter();
    const route = useRoute();
    const soldServiceId = route.params.sold_service_id;

    const fetchPrestationDetails = async () => {
      const response = await fetch(`http://peer.cesi/api/service/sell/${soldServiceId}`);
      if (response.ok) {
        const data = await response.json();
        name.value = data.name;
        description.value = data.description;
        price.value = data.price;
        status.value = data.status;
        advancement.value = data.advancement;
      } else {
        console.error('Erreur lors de la récupération de la prestation');
      }
    };

    const updatePrestation = async () => {
      try {
        const response = await fetch(`http://peer.cesi/api/service/sell/update/${soldServiceId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: name.value,
            description: description.value,
            price: price.value,
            status: status.value,
            advancement: advancement.value,
          }),
        });

        if (!response.ok) {
          throw new Error(`Erreur lors de la mise à jour de la prestation: ${response.status}`);
        }

        alert('Prestation mise à jour avec succès!');
        router.push(`/prestations/display/${soldServiceId}`);
      } catch (error) {
        if (error instanceof Error) {
          console.error('Erreur lors de la mise à jour de la prestation:', error.message);
          alert(`Erreur lors de la mise à jour de la prestation: ${error.message}`);
        }
      }
    };

    onMounted(fetchPrestationDetails);

    return {
      name,
      description,
      price,
      status,
      advancement,
      updatePrestation,
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
