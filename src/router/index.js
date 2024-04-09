import { createRouter, createWebHistory } from 'vue-router';
import InscriptionPage from '../views/RegistrationView.vue'; // Assurez-vous d'importer correctement votre composant d'inscription
import LoginPage from '../views/LoginView.vue'; // Importez également le composant de connexion si ce n'est déjà fait
const routes = [
    {
        path: '/',
        redirect: '/login',
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginPage,
    },
    {
        path: '/inscription',
        name: 'Inscription',
        component: InscriptionPage,
    },
    // Définissez d'autres routes selon vos besoins
];
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});
export default router;
