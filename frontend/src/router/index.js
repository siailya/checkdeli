import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/addusers',
        name: 'AddUsers',
        component: () => import("../views/AddUsers")
    },
    {
        path: "/calculating",
        name: "Calculating",
        component: () => import("../views/Calculating")
    },
    {
        path: "/results/:storestring?",
        name: "Results",
        component: () => import("../views/Results")
    },
    {
        path: "/intro",
        name: "Intro",
        component: () => import("../views/Intro")
    },
    {
        path: "/home",
        name: "Home",
        component: () => import("../views/CDUserHome")
    }
]

const router = new VueRouter({
    mode: "history",
    routes
})

export default router