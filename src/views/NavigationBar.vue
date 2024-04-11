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
        <button v-if="userRole === 'admin'" @click="navigateToServicesAdministrations">Administration des services</button>
        <button v-if="userRole === 'admin'" @click="navigateToPrestationsAdministrations">Administration des prestations</button>
        <button v-if="userRole === 'dev'" @click="navigateToMyPrestations">Mes prestations</button>
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

    const navigateToServicesAdministrations = () => {
      router.push('/myservices');
    };

    const navigateToPrestationsAdministrations = () => {
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
      navigateToServicesAdministrations,
      navigateToPrestationsAdministrations,
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
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1050;
}

.logo {
  height: 50px;
  cursor: pointer;
}

.search-bar {
  flex-grow: 1;
  margin: 0 1rem;
  padding: 0.5rem;
  border: 1px solid #ccc; /* Ajout d'une bordure pour définir clairement la zone de recherche */
  border-radius: 4px; /* Bordures arrondies pour la barre de recherche */
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
  color: #000000; /* Texte noir pour contraster avec le fond */
}

.dropdown-content {
  display: flex;
  flex-direction: column; /* Orientation verticale des éléments */
  position: absolute;
  right: 1rem;
  top: 48px;
  background-color: #f9f9f9;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  padding: 0; /* Enlever le padding ici pour permettre aux séparateurs de s'étendre sur toute la largeur */
  z-index: 1;
  border-radius: 8px; /* Bordures arrondies pour le menu */
  opacity: 0;
  visibility: hidden;
  transform: translateY(-20px);
  transition: all 0.3s ease; /* Transition douce pour l'apparition */
  z-index: 1050;
}

.navbar-menu:hover .dropdown-content {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-content button {
  text-align: left;
  font-size: 1rem;
  background: none;
  border: none;
  padding: 10px 20px; /* Ajout d'un padding horizontal pour aligner le texte */
  width: 100%;
  cursor: pointer;
  color: #333;
  white-space: nowrap; /* Empêche le retour à la ligne du texte */
  border-bottom: 1px solid #ddd; /* Ajoute des séparateurs entre les boutons */
  transition: background-color 0.2s; /* Effet de survol plus réactif */
}

.dropdown-content button:hover {
  background-color: #ddd; /* Couleur de fond plus claire au survol */
}

.dropdown-content button:last-child {
  border-bottom: none; /* Enlève le séparateur du dernier élément */
}
</style>
