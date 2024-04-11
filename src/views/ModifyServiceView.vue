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
    <div class="modify-service">
      <h2>Modifier vos Services</h2>
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
          router.push(`/service/display/${serviceId}`);
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
  
<style scoped>.modify-service {
    max-width: 600px;
    margin: 2rem auto;
    padding: 2rem;
    background: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
  }
  
  .modify-service h2 {
    color: #30475e; /* Utilisez la même couleur de titre que celle de la page des prestations */
    margin-bottom: 1.5rem;
    text-align: center;
  }
  
  form {
    display: flex;
    flex-direction: column;
  }
  
  form > div {
    display: flex;
    flex-direction: column;
    margin-bottom: 1.5rem;
  }
  
  label {
    margin-bottom: .5rem;
    color: #30475e; /* Assortir la couleur du label à celle de la page des prestations */
  }
  
  input[type="text"],
  textarea {
    padding: .8rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 100%; /* Assurez-vous que les champs de saisie s'étendent à la largeur complète */
  }
  
  button {
    padding: .8rem 2rem;
    margin-top: .5rem; /* Ajuster la marge supérieure pour correspondre à celle de la page des prestations */
    color: #fff;
    background-color: #30475e; /* Assortir la couleur du bouton à celle de la page des prestations */
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  button:hover {
    background-color: #1b2a49; /* Assombrir le bouton au survol, comme sur la page des prestations */
  }
  
</style>
  