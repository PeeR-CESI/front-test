<template>
  <div>
    <h2>Inscription</h2>
    <form @submit.prevent="createUser">
      <input v-model="nom" type="text" placeholder="Nom" />
      <input v-model="prenom" type="text" placeholder="Prénom" />
      <input v-model="email" type="email" placeholder="Email" />
      <input v-model="adresse" type="text" placeholder="Adresse" />
      <select v-model="role">
        <option value="demandeur">Demandeur</option>
        <option value="presta">Prestataire</option>
      </select>
      <input v-model="username" type="text" placeholder="Username" />
      <input v-model="password" type="password" placeholder="Password" />
      <button type="submit">S'inscrire</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'InscriptionPage',
  setup() {
    const nom = ref('');
    const prenom = ref('');
    const email = ref('');
    const adresse = ref('');
    const role = ref('demandeur');
    const username = ref('');
    const password = ref('');

    const createUser = async () => {
      try {
        const response = await fetch('http://peer.cesi/user/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nom: nom.value,
            prenom: prenom.value,
            email: email.value,
            adresse: adresse.value,
            role: role.value,
            username: username.value,
            password: password.value,
          }),
        });

        if (!response.ok) {
          throw new Error(`Erreur ${response.status}`);
        }

        const data = await response.json();
        console.log('Utilisateur créé:', data);

        // Gérer la redirection ou autres actions post-création ici
        // Par exemple : router.push('/login');
      } catch (error) {
        console.error('Erreur:', error);
      }
    };

    return {
      nom,
      prenom,
      email,
      adresse,
      role,
      username,
      password,
      createUser,
    };
  },
});
</script>
