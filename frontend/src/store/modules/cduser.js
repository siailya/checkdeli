import axios from "axios";
import {APIv1, BACKEND} from "../../../backend.config";
import jwt from "jsonwebtoken";

export default {
    state: {
        cduser: {},
        checks: [],
        checksLoading: true
    },
    actions: {
        async fetchChecks(ctx) {
            let data = await axios.get(BACKEND + APIv1 + "/checks/get/" + this.state.cduser.cduser._id)
            ctx.commit("updateCDUserChecks", data.data.checks)
        },
        async restoreAuth(ctx) {
            let res = await axios.get(BACKEND + APIv1 + "/relogin")
            if (res.data.status === "Successful relogin") {
                let user = jwt.decode(res.data.token).user
                ctx.commit("updateCDUser", user)
            }
        },
        clearCDUser(ctx) {
          ctx.commit("updateCDUser", {})
          ctx.commit("updateCDUserChecks", [])
        }
    },
    mutations: {
        updateCDUser(state, user) {
            user.id = Math.ceil(Math.random() * 10000)
            user.products = []
            state.cduser = user
            this.commit("addUser", user)
        },
        updateCDUserChecks(state, checks) {
            state.checks = checks
            state.checksLoading = false
        },
    },
    getters: {
        CDUser(state) {
            return state.cduser
        },
        checks(state) {
            return state.checks
        },
        checksLoading(state) {
            return state.checksLoading
        }
    },
}