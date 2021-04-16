import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Index',
        component: Home,
        meta: {
            title: null
        },
    },
    {
      path: "*",
      redirect: "/404"
    },
    {
        path: "/404",
        name: "NotFound",
        component: () => import("../views/NotFound"),
        meta: {
            title: "Ничего не нашлось"
        }
    },
    {
        path: '/addusers',
        name: 'AddUsers',
        component: () => import("../views/AddUsers"),
        meta: {
            title: "Добавить пользователя"
        }
    },
    {
        path: "/calculating",
        name: "Calculating",
        component: () => import("../views/Calculating"),
        meta: {
            title: "Добавить позицию"
        }
    },
    {
        path: "/results/:storestring?",
        name: "Results",
        component: () => import("../views/Results"),
        meta: {
            title: "Чекдели - результаты"
        }
    },
    {
        path: "/vk",
        name: "VKLogin",
        component: () => import("../views/VKLogin"),
        meta: {
            title: "Логинимся через ВК"
        }
    },
    {
        path: "/home",
        name: "Home",
        component: () => import("../views/CDUserHome"),
        meta: {
            title: "Чекдели - профиль"
        }
    }
]

const router = new VueRouter({
    mode: "history",
    routes
})

const DEFAULT_TITLE = 'Чекдели - разделить чек с друзьями!';
router.afterEach((to) => {
    Vue.nextTick(() => {
        document.title = to.meta.title || DEFAULT_TITLE;
    });
});

export default router
