export default {
    state: {
        users: []
    },
    actions: {
        addUser(ctx) {
            ctx.commit("addUser", {name: "", id: Math.ceil(Math.random() * 10000), products: []})
        },
        deleteUser(ctx, index) {
            let users = JSON.parse(JSON.stringify(this.state.users))
            users.splice(index, 1)
            ctx.commit("userDeleted", users)
        }
    },
    mutations: {
        addUser(state, user) {
            state.users.push(user)
        },
        updateUsers(state, users) {
            state.users = users
        },
        userDeleted(state, users) {
            state.users = users
        }
    },
    getters: {
        users(state) {
            return state.users
        },
        userById: state => id => {
            return state.users.find(user => user.id === id)
        }
    },
}