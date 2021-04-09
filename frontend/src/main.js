import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'bootstrap-vue/dist/bootstrap-vue-icons.min.css'

import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';

import VueCookie from 'vue-cookie';
import VueTilt from 'vue-tilt.js'

Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.use(VueCookie);
Vue.use(VueTilt)

Vue.component('v-select', vSelect)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
