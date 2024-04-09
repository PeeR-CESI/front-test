import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router';
import InscriptionPage from '../views/RegistrationView.vue';
import LoginPage from '../views/LoginView.vue';
import HomePage from "../views/HomeView.vue"; 
import CreateServicePage from '../views/CreateServiceView.vue';

const routes: Array<RouteRecordRaw> = [
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
    {
        path: '/home',
        name: 'Home',
        component: HomePage,
    },
    {
        path: '/service',
        name: 'Service',
        component: CreateServicePage,
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

export default router;
