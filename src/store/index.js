import Vue from 'vue'
import Vuex from 'vuex'
import users from "@/store/modules/users";
import products from "@/store/modules/products";
import result from "@/store/modules/result";

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    users,
    products,
    result
  }
})
