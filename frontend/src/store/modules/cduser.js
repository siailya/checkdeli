import VK from "vk-openapi";
import axios from "axios";
import {APIv1, BACKEND} from "../../../backend.config";

export default {
    state: {
        cduser: {},
        checks: []
    },
    actions: {
        addCDUser(ctx) {
            ctx.commit("addUser", {name: "", id: Math.ceil(Math.random() * 10000), products: []})
        },
        // eslint-disable-next-line no-unused-vars
        loginVK(ctx, payload) {
            VK.Auth.login((e) => {
                if (e.status === "connected"){
                    this._vm.$cookie.set("Authorization", "vk", {expires: "2h"})
                    this._vm.$cookie.set("VKSession", JSON.stringify(e), {expires: "2h"})

                    this.dispatch("restoreVK", e)
                    payload[0].hide("login_modal")
                    payload[1].push("/home")
                } else {
                    this.$bvModal
                }
            })
        },
        restoreVK(ctx, vk) {
            let user = vk.session.user
            user.type = "vk"
            user.name = vk.session.user.first_name
            user.surname = vk.session.user.last_name
            user.vkid = vk.session.user.id
            user.id = parseInt(vk.session.user.id)
            user.products = []
            VK.Api.call("users.get",
                {v: "5.130", user_ids: vk.session.user.id, fields: "photo_200"},
                (r) => {
                    user.avatar = r.response[0].photo_200
                    ctx.commit("updateCDUser", user)
                    ctx.commit("addUser", user)
                }
            )

            axios.post(BACKEND + APIv1 + "/login/vk", user).then(async r => {
                user.uid = r.data.uid
                axios.defaults.headers.common['CDUserId'] = r.data.uid;
                await this.dispatch("fetchChecks")
            })
        },
        // eslint-disable-next-line no-unused-vars
        async fetchChecks(ctx) {
            let data = await axios.get(BACKEND + APIv1 + "/checks/get/" + this.state.cduser.cduser.uid)
            ctx.commit("updateCDUserChecks", data.data.checks)
        }
    },
    mutations: {
        updateCDUser(state, user) {
            state.cduser = user
        },
        updateCDUserChecks(state, checks) {
            state.checks = checks
        }
    },
    getters: {
        CDUser(state) {
            return state.cduser
        },
        checks(state) {
            return state.checks
        }
    },
}