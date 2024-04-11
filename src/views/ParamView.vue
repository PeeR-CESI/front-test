<template>
  <div class="settings">
    <h2>Paramètres du compte</h2>
    <form @submit.prevent="updateUser">
      <div>
        <label for="nom">Nom:</label>
        <input id="nom" v-model="user.nom" type="text" placeholder="Votre nom">
      </div>
      <div>
        <label for="prenom">Prénom:</label>
        <input id="prenom" v-model="user.prenom" type="text" placeholder="Votre prénom">
      </div>
      <div>
        <label for="email">Email:</label>
        <input id="email" v-model="user.email" type="email" placeholder="Votre email">
      </div>
      <div>
        <label for="adresse">Adresse:</label>
        <input id="adresse" v-model="user.adresse" type="text" placeholder="Votre adresse">
      </div>
      <div>
        <label for="role">Rôle:</label>
        <select id="role" v-model="user.role">
          <option value="demandeur">Demandeur</option>
          <option value="presta">Prestataire</option>
        </select>
      </div>
      <div>
        <label for="username">Nom d'utilisateur:</label>
        <input id="username" v-model="user.username" type="text" placeholder="Votre nom d'utilisateur">
      </div>
      <div>
        <label for="password">Nouveau mot de passe:</label>
        <input id="password" v-model="user.password" type="password" placeholder="Nouveau mot de passe">
      </div>
      <div class="buttons">
        <button type="submit">Mettre à jour</button>
        <button @click="confirmAccountDeletion">Supprimer mon compte</button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import {useRouter} from "vue-router";

export default defineComponent({
  name: 'ParamView',
  setup() {
    const router = useRouter();
    const user = ref({
      nom: '',
      prenom: '',
      email: '',
      adresse: '',
      role: '',
      username: '',
      password: '',
    });
    const userId = localStorage.getItem('user_id'); // Récupération de l'ID utilisateur

    const updateUser = async () => {
      if (!userId) {
        console.error("Erreur : ID utilisateur non défini.");
        return;
      }

      try {
        const response = await fetch(`http://peer.cesi/api/user/update/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
          }),
        });

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        console.log('Compte mis à jour avec succès');
        alert('Compte mis à jour avec succès'); // Affichez un message d'alerte ou utilisez une autre méthode pour notifier l'utilisateur.
        // Redirigez l'utilisateur ou affichez un message, par exemple avec router.push('/quelquepart');
      } catch (error) {
        console.error("Erreur lors de la mise à jour du compte :", error);
        alert("Erreur lors de la mise à jour du compte : " + error); // Informez l'utilisateur de l'erreur.
      }
    };

    const confirmAccountDeletion = async () => {
      if (confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.")) {
        try {
          const response = await fetch(`http://peer.cesi:5000/user/delete/${userId}`, {
            method: 'DELETE',
            // Assurez-vous d'ajouter les headers nécessaires, par exemple pour l'authentification
          });

          if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
          }

          alert('Compte supprimé avec succès.');
          localStorage.clear(); // Supprimez toutes les données stockées pour l'utilisateur
          router.push('/login'); // Redirigez l'utilisateur vers la page de connexion
        } catch (error) {
          console.error("Erreur lors de la suppression du compte :", error);
          alert('Erreur lors de la suppression du compte.');
        }
      }
    };

    return {
      user,
      updateUser,
      confirmAccountDeletion
    };
  },
});
</script>

<style scoped>
.settings {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.settings h2 {
  color: #30475e;
  margin-bottom: 1.5rem;
  text-align: center;
}

form {
  width: 100%;
}

div:not(.buttons) {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 1rem;
}

label {
  margin-bottom: .5rem;
  color: #30475e;
}

input[type="text"],
input[type="email"],
input[type="password"],
select {
  padding: .8rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
}

.buttons {
  display: flex;
  flex-direction: column; /* Changez à la disposition en colonne pour l'alignement vertical */
}

button {
  padding: .8rem 2rem;
  margin: .5rem 0 0 0; /* Ajustez la marge pour supprimer l'espace à gauche du premier bouton et entre les boutons */
  color: #fff;
  background-color: #30475e;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 100%; /* Les boutons s'étendent à la pleine largeur */
}

button:hover {
  background-color: #1b2a49;
}

button:last-child {
  background-color: #f05454;
}

button:last-child:hover {
  background-color: #c04848;
}

</style>
