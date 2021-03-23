export default {
    state: {
        payers: [],
        who_whom: {},
        whom_who: {},
        hashed_result: ""
    },
    actions: {
    },
    mutations: {
        updatePayers(state, payers) {
            state.payers = payers
        },
        updateWhomWho(state, whom_who) {
            state.whom_who = whom_who
        },
        updateWhoWhom(state, who_whom) {
            state.who_whom = who_whom
        }
    },
    getters: {
        payers(state) {
            return state.payers
        },
        who_whom(state) {
            return state.who_whom
        },
        whom_who(state) {
            return state.whom_who
        },
    },
}