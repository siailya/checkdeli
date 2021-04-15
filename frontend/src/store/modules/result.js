export default {
    state: {
        payers: [],
        who_whom: {},
        whom_who: {},
    },
    actions: {
        calculateResults(ctx) {
            let who_whom = {}, whom_who = {}, payers = [];
            let time = performance.now();

            this.users = ctx.getters.users
            this.products = ctx.getters.products

            this.users.forEach((user) => {
                who_whom[user.id] = {}
                user.products = []
            })

            this.products.forEach((product) => {
                if (payers.indexOf(product.payed) === -1){
                    payers.push(product.payed)
                    whom_who[product.payed] = {}
                }
                let one_pay = parseFloat((product.cost / product.users.length).toFixed(2))
                this.users.forEach((user) => {
                    if (product.users.indexOf(user.id) !== -1) {
                        if(user.products.find((prd) => {return prd.product_id === product.id}) === undefined){
                            user.products.push({product_id: product.id, amount: one_pay})
                        }
                        who_whom[user.id][product.payed] = (who_whom[user.id][product.payed] || 0) + one_pay
                        whom_who[product.payed][user.id] = (whom_who[product.payed][user.id] || 0) + one_pay
                    }
                })
            })

            // Балансировка
            if (payers.length >= 2) {
                payers.forEach((payer_id) => {
                    payers.forEach((payer_id2) => {
                        if (payer_id2 !== payer_id) {
                            let from_p_to_p2 = whom_who[payer_id2][payer_id] || 0
                            let from_p2_to_p = whom_who[payer_id][payer_id2] || 0
                            if ((from_p_to_p2 > 0) && (from_p2_to_p > 0)){
                                if (from_p_to_p2 >= from_p2_to_p) {
                                    whom_who[payer_id2][payer_id] = whom_who[payer_id2][payer_id] - from_p2_to_p
                                    whom_who[payer_id][payer_id2] = 0

                                    who_whom[payer_id][payer_id2] = who_whom[payer_id][payer_id2] - from_p2_to_p
                                    who_whom[payer_id2][payer_id] = 0
                                }
                            }
                        }
                    })
                })
            }

            console.log('Все раскидано примерно за', performance.now() - time, 'мс')
            ctx.commit("updatePayers", payers)
            ctx.commit("updateWhomWho", whom_who)
            ctx.commit("updateWhoWhom", who_whom)
        }
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