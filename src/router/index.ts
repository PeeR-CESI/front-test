import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router';
import RegistrationPage from '../views/RegistrationView.vue';
import LoginPage from '../views/LoginView.vue';
import HomePage from "../views/HomeView.vue";
import AccountParameterPage from '../views/ParamView.vue';
import CreateServicePage from '../views/CreateServiceView.vue';
import DisplayServicePage from '../views/DisplayServiceView.vue';
import ModifyMyServicePage from '../views/ModifyMyServiceView.vue';
import BoughtServicePage from "../views/BoughtServiceView.vue";
import UserListPage from '../views/UserListView.vue';
import UserDetailsPage from '../views/UserDetailsView.vue';
import SoldServicePage from "../views/SoldServiceView.vue";


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
        path: '/register',
        name: 'Register',
        component: RegistrationPage,
    },
    {
        path: '/home',
        name: 'Home',
        component: HomePage, // Assurez-vous que HomeView est importé correctement
        beforeEnter: (to, from, next) => {
            // Vérifiez si l'utilisateur a un token d'accès
            if (localStorage.getItem('access_token')) {
                next();
            } else {
                next({ name: 'Login' }); // Redirige vers la page de connexion si aucun token n'est trouvé
            }
        },
    },
    {
        path: '/account/parameters',
        name: 'Parameters',
        component: AccountParameterPage,
        beforeEnter: (to, from, next) => {
            if (localStorage.getItem('access_token')) {
                next();
            } else {
                next({ name: 'Login' }); // Redirige vers la page de connexion si aucun token n'est trouvé
            }
        },
    },
    // {
    //     path: '/admin/statistics', // Redirige les admins vers la page de statistiques d'utilisation de la plateforme
    //     name: 'Statistics',
    //     component: StatisticsPage,
    // },
    // {
    //     path: '/dev/components', // le but ici c'est d'avoir le lien qui redirige vers les swaggers API
    //     name: 'API',
    //     component: APIPage,
    // },
    {
        path: '/service/create',
        name: 'ServiceCreate',
        component: CreateServicePage,
        props: true,
    },
    {
        path: '/service/display/:service_id',
        name: 'DisplayService',
        component: DisplayServicePage,
        props: true,
    },
    {
        path: '/service/update/:service_id',
        name: 'ModifyService',
        component: ModifyMyServicePage,
        props: true,
    },
    {
        path: '/myorders',
        name: 'MyOrders',
        component: BoughtServicePage,
        props: true,
    },
    {
        path: '/myprestations',
        name: 'MyPrestations',
        component: SoldServicePage,
        props: true,
    },
    {
        path: '/user-list',
        name: 'UserList',
        component: UserListPage,
    },
    {
        path: '/user-details/:id',
        name: 'UserDetails',
        component: UserDetailsPage,
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

export default router;
