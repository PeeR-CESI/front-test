<template>
  <div class="login-container">
    <div class="login-box">
      <img :src="logoPath" alt="Logo" class="logo"/>
      <form @submit.prevent="login">
        <div class="form-group">
          <label for="username">Username:</label>
          <input id="username" v-model="credentials.username" type="text" required>
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input id="password" v-model="credentials.password" type="password" required>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn-login">Connexion</button>
          <button type="button" class="btn-register" @click="goToInscription">Inscription</button>
        </div>
        <div v-if="error" class="error-message">
          <p>{{ errorMessage }}</p>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from "vue-router";
import logoPath from '../assets/image.png';

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
      router.push('/register');
    };

    const login = async () => {
      error.value = false;
      errorMessage.value = '';

      try {
        const response = await fetch('http://peer.cesi/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials.value),
        });

        if (!response.ok) {
          throw response;
        }

        const data = await response.json();
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        localStorage.setItem('user_id', data.user_id);
        localStorage.setItem('role', data.role);
        localStorage.setItem('username', data.username);
        router.push('/home');
      } catch (err) {
        error.value = true;
        if (err instanceof Response) {
          if (err.status === 404) {
            errorMessage.value = 'Nom d’utilisateur non trouvé.';
          } else if (err.status === 401) {
            errorMessage.value = 'Mot de passe incorrect.';
          } else {
            errorMessage.value = 'Erreur lors de la connexion.';
          }
        } else {
          errorMessage.value = 'Une erreur inconnue est survenue.';
        }
      }
    };

    return {
      credentials,
      error,
      errorMessage,
      login,
      goToInscription,
      logoPath
    };
  },
});
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f2f2f2;
}

.login-box {
  padding: 2rem;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
  max-width: 600px;
}

.logo {
  width: 150px;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
}

label {
  margin-bottom: 0.5rem;
  color: #30475e;
}

input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.form-actions {
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
}

.btn-login,
.btn-register {
  padding: 0.8rem 2rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 0.5rem;
  color: #fff;
  transition: background-color 0.3s;
}

.btn-login {
  background-color: #30475e;
}

.btn-login:hover {
  background-color: #1b2a49;
}

.btn-register {
  background-color: #007bff;
  color: #fff;
  border: 1px solid #007bff;
}

.btn-register:hover {
  background-color: #0056b3;
}

.error-message {
  color: #ff0000;
  margin-top: 1rem;
}
</style>
