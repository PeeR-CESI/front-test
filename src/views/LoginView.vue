<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="login">
      <div>
        <label for="username">Username:</label>
        <input id="username" v-model="credentials.username" type="text" required>
      </div>
      <div>
        <label for="password">Password:</label>
        <input id="password" v-model="credentials.password" type="password" required>
      </div>
      <button type="submit">Login</button>
      <div v-if="error">
        <p>{{ errorMessage }}</p>
      </div>
      <button @click="goToInscription">Inscription</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import {useRouter} from "vue-router";

export default defineComponent({
  name: 'LoginPage',
  setup() {
    const router = useRouter();
    const credentials = ref({
      username: '',
      password: '',
    });
    const error = ref(false);
    const errorMessage = ref('');
    const goToInscription = () => {
      router.push('/inscription');
    };

    const login = async () => {
      error.value = false;
      errorMessage.value = '';

      try {
        const response = await fetch('http://peer.cesi:5000/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials.value),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Connexion réussie:', data);
          // Ici, vous devriez enregistrer les tokens et rediriger l'utilisateur.
          localStorage.setItem('accessToken', data.access_token);
          localStorage.setItem('refreshToken', data.refresh_token);
          router.push('/home'); // Redirige vers la page d'accueil.
        } else {
          // Gérez les erreurs HTTP ici
          error.value = true;
          const errorData = await response.json();
          errorMessage.value = errorData.message || 'Une erreur est survenue lors de la connexion.';
        }
      } catch (err) {
        // Gérez les erreurs de réseau ou autres erreurs inattendues ici
        console.error('Erreur réseau ou inattendue:', err);
        error.value = true;
        errorMessage.value = 'Une erreur réseau ou inconnue est survenue.';
      }
    };

    return {
      credentials,
      error,
      errorMessage,
      login,
      goToInscription,
    };
  },
});
</script>

<style scoped>
/* Vos styles ici */
</style>
