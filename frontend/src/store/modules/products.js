// eslint-disable-next-line no-unused-vars
import axios from "axios";
// eslint-disable-next-line no-unused-vars
import {APIv1, BACKEND} from "../../../backend.config";

export default {
    state: {
        cdid: null,
        checkTitle: "",
        checkDate: null,
        checkCreated: "",
        products: [],
        defaultPayed: ""
    },
    actions: {
        addProduct(ctx) {
            ctx.commit("addProduct", {
                title: "",
                quantity: 1,
                cost: "",
                id: Math.ceil(Math.random() * 1000),
                users: [],
                payed: this.state.products.defaultPayed
            })
        },
        deleteProduct(ctx, index) {
            let products = JSON.parse(JSON.stringify(this.state.products)).products
            products.splice(index, 1)
            ctx.commit("updateProducts", products)
        },
        addUserToProduct(ctx, props) {
            let products = JSON.parse(JSON.stringify(this.state.products)).products
            if (products[props.index].users.indexOf(props.user_id) === -1) {
                products[props.index].users.push(props.user_id)
            } else {
                products[props.index].users.splice(products[props.index].users.indexOf(props.user_id), 1)
            }
            ctx.commit("updateProducts", products)
        },
        setDefaultPayed(ctx, payed) {
            ctx.commit("defaultPayedSet", payed)
        },
        setProductPayed(ctx, props){
            let products = JSON.parse(JSON.stringify(this.state.products)).products
            products.find((product) => {return product.id === props.id}).payed = props.payed
            ctx.commit("updateProducts", products)
        },
        setCDID(ctx, cdid){
            ctx.commit("updateCDID", cdid)
        },
        setTitle(ctx, title){
            ctx.commit("updateTitle", title)
        },
        setDate(ctx, date){
            ctx.commit("updateDate", date)
        },
        createNewCheck(ctx){
            axios.post(BACKEND + APIv1 + "/checks/create", {title: this.state.products.checkTitle, date: Date.parse(this.state.products.checkDate), defaultPayed: this.state.products.defaultPayed, products: this.state.products.products, users: this.state.users.users}).then((r) => {
                if (r.data.status === "Successfully created") {
                    ctx.commit("updateCDID", r.data.cdid)
                }
            })
        },
        async updateCheck(){
            await axios.post(BACKEND + APIv1 + "/checks/update", {cd: this.state.products, users: this.state.users.users})
        }
    },
    mutations: {
        addProduct(state, product) {
            state.products.push(product)
        },
        updateProducts(state, products) {
            state.products = products
        },
        defaultPayedSet(state, payed) {
            state.defaultPayed = payed
        },
        updateCDID(state, cdid) {
            state.cdid = cdid
        },
        updateTitle(state, title){
            state.checkTitle = title
        },
        updateDate(state, date){
            state.checkDate = date
        },
    },
    getters: {
        products(state) {
            return state.products
        },
        defaultPayed(state) {
            return state.defaultPayed
        },
        productById: state => id => {
          return state.products.find((product) => {return product.id === id})
        },
        cdid(state) {
            return state.cdid
        },
        checkTitle(state) {
            return state.checkTitle
        },
        checkDate(state) {
            return state.checkDate
        },
        checkCreated(state) {
            return state.checkCreated
        }
    },
}