<template>
  <nav class="navbar">
    <img :src="logoPath" alt="Logo" class="logo" @click="navigateToHome" />
    <input class="search-bar" type="text" placeholder="Rechercher des services..." />
    <div class="navbar-menu">
      <button @click="toggleDropdown" class="menu-button">☰</button>
      <div v-if="dropdownVisible" class="dropdown-content">
        <button @click="showSponsorModal = true">Parrainer un ami</button>
        <button @click="navigateToUserList">Voir tous les utilisateurs</button>
        <button @click="navigateToForum">Forum</button>
        <button @click="goToSettings">Paramètres</button>
        <button v-if="userRole === 'demandeur'" @click="navigateToMyOrders">Mes commandes</button>
        <button v-if="userRole === 'presta'" @click="navigateToMyServices">Mes Services</button>
        <button v-if="userRole === 'presta'" @click="navigateToMyPrestations">Mes prestations</button>
        <button @click="logout">Déconnexion</button>
      </div>
    </div>
  </nav>
  <!-- Modal pour parrainage -->
  <div v-if="showSponsorModal" class="modal">
    <div class="modal-content">
      <h2>Parrainer un ami pour bénéficier d'avantages exclusifs</h2>
      <p>Parrainer un ami pour bénéficier d'avantages exclusifs tels que la mise en avant de vos services sur notre site ou -10% sur votre prochaine achat.</p>
      <input v-model="sponsorEmail" type="email" placeholder="Email de l'ami" />
      <button @click="sendSponsorEmail">Envoyer</button>
      <button @click="showSponsorModal = false">Fermer</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import logoPath from '../assets/image.png';

export default defineComponent({
  name: 'NavigationBar',
  setup() {
    const router = useRouter();
    const showSponsorModal = ref(false);
    const sponsorEmail = ref('');

    const userRole = computed(() => localStorage.getItem('role'));

    const navigateToMyOrders = () => {
      router.push('/myorders');
    };

    const navigateToMyServices = () => {
      router.push('/myservices');
    };

    const navigateToMyPrestations = () => {
      router.push('/myprestations');
    };

    const dropdownVisible = ref(false);
    const toggleDropdown = () => {
      dropdownVisible.value = !dropdownVisible.value;
    };
    const goToSettings = () => {
      router.push('/account/parameters');
    };

    const navigateToHome = () => {
      router.push('/home');
    };

    const navigateToUserList = () => {
      router.push('/user-list');
    };

    const navigateToForum = () => {
      // Remplacez par le chemin réel vers la page du forum lorsque prêt
      router.push('/forum');
    };

    const logout = () => {
      localStorage.clear(); // Supprime tous les éléments stockés dans localStorage
      router.push('/login');
    };

    const sendSponsorEmail = async () => {
      try {
        const response = await fetch('http://peer.cesi/api/sponsor/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: sponsorEmail.value }),
        });

        if (!response.ok) {
          throw new Error('Erreur lors de l\'envoi de l\'email');
        }

        // Réinitialisation pour fermer le pop-up et nettoyer le champ email
        showSponsorModal.value = false;
        sponsorEmail.value = '';

        alert('Email envoyé avec succès');
      } catch (error) {
        console.error(error);
        alert('Erreur lors de l\'envoi de l\'email');
      }
    };

    return {
      navigateToHome,
      navigateToUserList,
      navigateToForum,
      logout,
      showSponsorModal,
      sponsorEmail,
      sendSponsorEmail,
      logoPath,
      goToSettings,
      toggleDropdown,
      dropdownVisible,
      navigateToMyOrders,
      navigateToMyServices,
      navigateToMyPrestations,
      userRole
    };
  },
});
</script>

<style scoped>
.navbar {
  background-color: #e1e1e1; /* Choisir votre couleur */
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
}

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.logo {
  height: 40px; /* Taille du logo plus petite */
  cursor: pointer;
}

.search-bar {
  flex-grow: 1;
  margin: 0 1rem;
  padding: 0.5rem;
}

.navbar-menu {
  display: flex;
  align-items: center;
  position: relative;
}

.menu-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.dropdown-content {
  /* Pas de 'display: none;' ici car v-show s'en occupe */
  position: absolute;
  right: 1rem;
  top: 48px; /* ajuster selon la hauteur de votre barre de navigation */
  background-color: #f9f9f9;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  padding: 12px 16px;
  z-index: 1;
}

.dropdown-content.show {
  display: block; /* afficher lorsque le menu est activé */
}

.dropdown-content button {
  text-align: left;
  background: none;
  border: none;
  padding: 10px;
  width: 100%;
  cursor: pointer;
}

.dropdown-content button:hover {
  background-color: #f1f1f1;
}
</style>
