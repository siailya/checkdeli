<template>
  <div class="calculating-wrapper">
    <b-modal id="change_payed" content-class="cd-card" centered hide-header hide-footer>
      <div class="header text-center">Изменить плательщика</div>
      <div class="who text-center">
        {{ selectedProduct.title ? 'Кто платил за "' + selectedProduct.title + '"?' : "Кто платил за это?" }}
      </div>
      <div
          class="user-cell d-flex justify-content-between"
          v-for="(user, index) in users"
          :key="user.id"
          @click="setProductPayed({id: selectedProduct.id, payed: user.id}); selectedProduct = products.find((product) => {return product.id === selectedProduct.id})"
      >
        <div class="d-flex w-100 main-content mb-1" :id="'main_content_' + index">
          <div class="avatar d-inline-block">
            <img :src="'https://icotar.com/initials/' + (user.name || '~') + '?fg=' + mainColor + '&bg=ffffff'" alt="">
          </div>
          <div class="name ml-3 align-self-center">
            {{ user.name }}
          </div>
          <div class="payed-radio ml-auto mt-auto mb-auto">
            <transition name="bounce">
              <div class="payed-radio-in" v-if="selectedProduct.payed === user.id">
              </div>
            </transition>
          </div>
        </div>
      </div>
    </b-modal>
    <div class="calculating">
      <div class="cd-card products-header mt-3">
        <div class="button-wrapper d-flex justify-content-center">
          <button class="active-btn add-product-btn shadowed" @click="addProduct">
            <span class="color-text d-flex align-items-center"><i class="material-icons mr-2">add_circle_outline</i>Добавить позицию</span>
          </button>
          <button class="active-btn settings-products-btn ml-3 d-flex align-items-center shadowed" @click="setSnackbar('Настройки я еще не изобрел :(')">
            <i class="color-text material-icons">settings</i>
          </button>
        </div>
      </div>
      <div class="cd-card products-wrapper" ref="products_wrapper">
        <transition name="fade">
          <div v-if="products.length <= 0" class="empty-products text-center">
                <span class="">
                  <i class="material-icons">delete_outline</i>
                  <br>
                  Ваша продуктовая корзина пуста...
                </span>
          </div>
        </transition>
        <transition-group type="transition" name="slide-left" tag="div">
          <div
              class="product-cell"
              v-for="(product, index) in products_list"
              :key="product.id"
              :id="'product_cell_' + index"
          >
            <div class="d-flex w-100 main-content" :id="'main_content_' + index">
              <input class="form-control" maxlength="30" :ref="'title_' + product.id" placeholder="Название" v-model="product.title"/>
              <input type="number" class="form-control ml-1" :ref="'cost_' + product.id" @input="e => {editInput(e, index)}" placeholder="Цена" v-model="product.cost">
              <div class="other-toggle mt-auto mb-auto" @click="() => {toggleOtherContent(index)}">
                <i class="material-icons ml-2 other-expand"
                   :class="openedCells.indexOf(index) !== -1 ? 'other-less' : 'other-more'">expand_more</i>
              </div>
            </div>
            <transition name="fade">
              <div class="other-content" :id="'other_content_' + index" v-if="openedCells.indexOf(index) !== -1">
                <div class="delete-product mb-2 d-flex">
                  <button class="payed-product-btn w-100 mr-1 shadowed" v-b-modal.change_payed
                          @click="selectedProduct = product">
                    <span class="color-text d-flex justify-content-center align-items-center">
                      <i class="material-icons mr-1">account_balance_wallet</i>
                      {{
                        users.filter((user) => {
                          return user.id === product.payed
                        })[0].name
                      }}
                    </span>
                  </button>
                  <button class="delete-product-btn w-50 ml-1 shadowed" @click="() => deleteProductItem(index)">
                    <span class="d-flex justify-content-center align-items-center">
                      <i class="material-icons mr-1">delete_outline</i>
                      Удалить
                    </span>
                  </button>
                </div>
                <div class="product-users d-flex">
                  <div class="bordered all-product-users text-center" @click="toggleAllUsers(product, index)">
                    <div class="avatar m-auto">
                      <transition name="bounce">
                        <img key="initials" v-if="!allUsersChecked(product)"
                             :src="'https://icotar.com/initials/' + ('∞') + '?fg=' + mainColor + '&bg=ffffff'" alt="">
                        <img key="checked" v-else :src="'https://icotar.com/initials/∞?fg=ffffff&bg=' + mainColor" alt="">
                      </transition>
                    </div>
                    Все
                  </div>
                  <div class="bordered product-user text-center" @click="toggleProductUser(index, user.id)"
                       v-for="(user, user_index) in users" :key="user_index">
                    <div class="avatar m-auto"
                         :style="product.users.indexOf(user.id) === -1 ? 'background: white' : 'background: var(--main)'">
                      <transition name="bounce">
                        <img key="initials" v-if="product.users.indexOf(user.id) === -1"
                             :src="'https://icotar.com/initials/' + (user.name || '~') + '?fg=' + mainColor + '&bg=ffffff'" alt="">
                        <img key="checked" v-else :src="'https://icotar.com/initials/✓?fg=ffffff&bg=' + mainColor" alt="">
                      </transition>
                    </div>
                    {{ user.name }}
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </transition-group>
      </div>
      <div class="cd-card pre-result mt-3">
        Промежуточный итог:
        <div class="result">
          {{
            products.map((item) => {
              return (parseInt(item.cost) || 0) * item.quantity
            }).reduce((a, b) => a + b, 0)
          }} ₽
        </div>
      </div>
      <div class="cd-card next-wrapper mt-3 mb-3">
        <button class="active-btn next-btn shadowed" id="next-btn" @click="validateNext">
            <span class="d-flex justify-content-center align-items-center">
            К результатам!
            </span>
        </button>
      </div>
    </div>
    <transition name="slide-up" appear>
      <div class="snackbar cd-card text-center text-white" id="snackbar" v-if="snackbar_show" @click="snackbarClose">
        <transition name="fade">
          <span>
            {{snackbar_text}}
          </span>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
// eslint-disable-next-line no-unused-vars
import jwt from "jsonwebtoken";


export default {
  name: "Calculating",
  data() {
    return {
      drag: false,
      currentOpen: null,
      openedCells: [],
      selectedProduct: {},
      snackbar_show: false,
      snackbar_text: ""
    }
  },
  computed: {
    ...mapGetters(["products", "users"]),
    products_list: {
      get() {
        return this.products
      },
      set(value) {
        this.$store.commit('updateProducts', value)
      }
    },
    mainColor() {
      return window.getComputedStyle(document.documentElement).getPropertyValue('--main').substr(2)
    },
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      };
    }
  },
  methods: {
    ...mapActions(["addProduct", "deleteProduct", "addUserToProduct", "setProductPayed"]),
    toggleOtherContent(index) {
      let itemIndex = this.openedCells.indexOf(index)
      if (itemIndex === -1) {
        this.openedCells.push(index)
      } else {
        this.openedCells.splice(itemIndex, 1)
        document.getElementById(`other_content_${index}`).style.height = "0px"
        document.getElementById(`other_content_${index}`).style.padding = "0px"
        document.getElementById(`other_content_${index}`).style.margin = "0px"
      }
    },
    toggleProductUser(index, user_id) {
      this.addUserToProduct({index, user_id})
    },
    editInput(e, index) {
      if (parseInt(e.currentTarget.value) > 99999){
        this.products[index].cost = 99999
      }
      if (parseInt(e.currentTarget.value) < 1){
        this.products[index].cost = 1
      }
    },
    validateNext() {
      function showWrong(text) {
        let el = document.getElementById("next-btn")
        el.style.animation = "wrong .3s infinity"
        el.classList.add("next-btn-wrong")
        el.style.backgroundColor = "var(--wrong)"
        el.children[0].classList.remove("color-text")
        el.children[0].innerHTML = text
        el.children[0].style.fontWeight = "400"
        // el.children[0].style.fontSize = "16px"
        setTimeout(() => {
          // el.children[0].style.fontSize = "18px"
          el.classList.remove("next-btn-wrong")
          el.style.animation = ""
          el.children[0].style.fontWeight = "500"
          el.style.backgroundColor = "var(--btn-background)"
          el.children[0].classList.add("color-text")
          el.children[0].innerHTML = "Дальше!"
        }, 2500)
      }

      let oc = JSON.parse(JSON.stringify(this.openedCells))
      for (let i in oc) {
        this.toggleOtherContent(oc[i])
      }

      if (this.products.length < 2) {
        if (this.products.length === 1) {
          showWrong("Калькулятор не под рукой?")
        } else {
          showWrong("Туса без всего - лучшая туса!")
        }
      } else if (this.products.filter((el) => {
        return el.title.trim() === ''
      }).length !== 0) {
        this.$refs["title_" + this.products.filter((el) => {
          return el.title.trim() === ''
        })[0].id][0].focus()

        showWrong("Назови все продукты!")
      } else if (this.products.filter((el) => {
        return el.cost.trim() === ''
      }).length !== 0){
        this.$refs["cost_" + this.products.filter((el) => {
          return el.cost.trim() === ''
        })[0].id][0].focus()
        showWrong("Бесплатно??")
      } else if (this.products.map((item) => {return item.users.length}).some((item) => {return item === 0})) {
        this.toggleOtherContent(this.products.map((item) => {return item.users.length}).indexOf(0))
        showWrong("Отдай нетронутое мне!")
      } else{
        this.calculateResults()
        this.$router.push("/results")
        // location.hash = jwt.sign({
        //   data: JSON.stringify(this.$store.state)
        // }, 'ispolzuyuJWTdlyaheshirovaniyastate')
      }
    },
    setSnackbar(text) {
      this.snackbar_text = text
      clearInterval(this.snackbar_show)
      this.snackbar_show = setTimeout(() => {
        this.snackbar_show = false
      }, 3500)
    },
    toggleAllUsers(product, index) {
      if (!this.allUsersChecked(product)) {
        for (let user in this.users) {
          if (!(product.users.indexOf(this.users[user].id) !== -1)) this.toggleProductUser(index, this.users[user].id)
        }
      } else {
        for (let user in this.users) {
          if (!(product.users.indexOf(this.users[user].id) === -1)) this.toggleProductUser(index, this.users[user].id)
        }
      }
    },
    allUsersChecked(product) {
      for (let user in this.users) {
        if (!(product.users.indexOf(this.users[user].id) !== -1)) return false
      }
      return true
    },
    deleteProductItem(index) {
      this.openedCells.splice(this.openedCells.indexOf(index), 1)
      this.openedCells = this.openedCells.map((i) => {
        if (i > index) {return i - 1}
        else {return i}
      })

      clearInterval(this.snackbar_show)
      this.snackbar_show = setTimeout(() => {
        this.snackbar_show = false
      }, 3500)

      let answers = [`Удалили ${this.products[index].title || "это"}. И правильно!`,
      `Правильно, зачем нам ${this.products[index].title || "это"}`,
      `Удаляй, удаляй ${this.products[index].title || "это"}, еще добавим`,
      `И зачем удалять ${this.products[index].title || "это"}?`,
      `Ладно.`,
      ]
      this.snackbar_text = answers[Math.floor(Math.random() * answers.length)]
      this.deleteProduct(index)
    },
    snackbarClose() {
      clearInterval(this.snackbar_show)
      this.snackbar_show = false
    },
    calculateResults() {
      let who_whom = {}, whom_who = {}, payers = [];
      let time = performance.now();

      this.users.forEach((user) => {
        who_whom[user.id] = {}
      })

      this.products.forEach((product) => {
        if (payers.indexOf(product.payed) === -1){
          payers.push(product.payed)
          whom_who[product.payed] = {}
        }
        let one_pay = parseFloat((product.cost / product.users.length).toFixed(2))
        this.users.forEach((user) => {
          if (product.users.indexOf(user.id) !== -1) {
            console.log(product)
            console.log(user.products)
            if(user.products.find((prd) => {return prd.product.id === product.id}) === undefined){
              user.products.push({product: product, amount: one_pay})
            }
            who_whom[user.id][product.payed] = (who_whom[user.id][product.payed] || 0) + one_pay
            whom_who[product.payed][user.id] = (whom_who[product.payed][user.id] || 0) + one_pay
          }
        })
      })

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

      console.log(JSON.stringify(this.users[0]))

      this.$store.commit("updatePayers", payers)
      this.$store.commit("updateWhomWho", whom_who)
      this.$store.commit("updateWhoWhom", who_whom)
    }
  },
}
</script>

<style scoped lang="scss">
@use "sass:color";
@import "public/colors";

.snackbar {
  position: fixed;
  width: 90%;
  margin-left: 5%;
  bottom: 2vh;
  margin-right: 0;
  border-radius: 15px;
}

html[theme="glass"]{
  .snackbar{
    background: rgba($main, 0.75)!important;
  }
}

html[theme="light"]{
  .snackbar{
    background: rgba($light_main, 0.75)!important;
  }
}

html[theme="dark"]{
  .snackbar{
    background: rgba($dark_main, 0.75)!important;
  }
}

.calculating {
  padding: 0 16px;
}

.products-header {
  border-radius: 15px 15px 0 0!important;
  box-shadow: 0 0 0 0 rgba(31, 38, 135, 0.1);
  overflow: hidden;
  padding: 0!important;
  border-bottom: none;
}

.button-wrapper {
  background: rgba(255, 255, 255, 0.5);
  padding: 15px 10px;

  button {
    span {
      font-weight: 500;
    }
  }
}

html[theme="dark"]{
  .button-wrapper {
    background: var(--background-light);
  }
}

.add-product-btn, .settings-products-btn {
  border: none;
  outline: none;
  border-radius: 30px;
  padding: 8px 12px;
  background: var(--btn-background);
  font-size: 18px;
}

@media screen and (max-width: 360px) {
  .add-product-btn {
    font-size: 14px;
  }
}

.settings-products-btn {
  padding: 9px;
}

.products-wrapper {
  border-radius: 0 0 15px 15px!important;
  height: 85vh;
  overflow: auto;
  overflow-x: hidden;
  box-shadow: 0px 5px 10px 2px rgba(50, 50, 50, 0.15)!important;
}

html[theme="light"] {
  .products-wrapper{
    border-top: 1px solid var(--border);
  }
}

.empty-products {
  position: absolute;
  top: 30%;
  width: 90%;
  left: 5%;
  color: var(--text-color);
  margin-top: 10px;

  span {
    i {
      font-size: 72px;
      color: var(--main);
    }
    font-weight: 400;
    font-size: 18px;
  }
}

.product-cell {
  transition: all .3s;
  cursor: move;
  padding: 8px;
  overflow: hidden;
  border-radius: 10px;

  input {
    margin-top: auto;
    margin-bottom: auto;
    outline: none;
  }
}

.other-expand {
  transition: all .3s;
  color: var(--main);
}

.other-less {
  transform: rotate(180deg);
}

.other-content{
  transition: all .3s;
  overflow: auto;
  height: 130px;
  padding: 5px;
  margin-top: 5px;
  border-radius: 15px 15px;

}

html[theme="glass"] .other-content {
  border: solid rgba(255, 255, 255, 0.2) .5px;
  background: rgba(200, 200, 200, 0.4);
}

html[theme="light"] .other-content {
  border: solid var(--border) .5px;
  background: rgba(200, 200, 200, 0.1);
}

html[theme="dark"] .other-content {
  border: solid var(--border) .5px;
  background: var(--background-light);
}

.delete-product-btn, .payed-product-btn {
  background-color: var(--wrong);
  color: white;
  border: none;
  border-radius: 15px;
  padding: 4px 8px;

  span {
    font-weight: 500;
    font-size: 0.85em;

    i {
      font-size: 20px;
    }
  }
}

.payed-product-btn {
  background: white;
}

html[theme="dark"] {
  .payed-product-btn{
    background: var(--background-light);
  }
}

.product-users {
  width: auto;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
}

.avatar {
  border: 1px solid var(--border);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  transition: all .3s;

  img {
    border-radius: 50px;
  }
}

html[theme="light"] {
  .avatar {
    border: 1px solid var(--border);
  }

  .next-wrapper{
    box-shadow: none;
    padding: 15px 0;
  }
}

html[theme="dark"] {
  .avatar {
    border: 1px solid var(--border-light);
  }
}

.product-user, .all-product-users {
  border-radius: 10px;
  //border: solid rgba(255, 255, 255, 0.5) .5px;
  background: rgba(230, 230, 230, 0.4);
  margin-right: 5px;
  padding: 5px 8px;
  font-size: 0.7em;
  color: var(--text-color);
}

html[theme="glass"]{
  .product-user, .all-product-users {
    background: rgba(230, 230, 230, 0.4);
  }
}

html[theme="light"]{
  .product-user, .all-product-users {
    background: white;
  }
}
.pre-result {
  border-radius: 15px;
  text-align: center;
  color: var(--text-color);

  .result {
    font-weight: 500;
    font-size: 30px;
  }
}

.header, .who, .name {
  color: var(--text-color);
  font-weight: 400;
}

.header {
  font-weight: 600;
  font-size: 20px;
}

.payed-radio {
  border-radius: 50px;
  border: var(--border) solid 2px;
  height: 18px;
  width: 18px;
  padding: 2px;

  .payed-radio-in {
    width: 100%;
    height: 100%;
    background: var(--main);
    border-radius: 50px;
    transition: all .3s;
  }
}

.next-btn.shadowed{
  box-shadow: 0 5px 10px 2px rgba(50, 50, 50, 0.15);
}

</style>

<style>
.bounce-enter-active {
  animation: bounce-in .3s;
}

.bounce-leave-active {
  animation: bounce-in .3s reverse;
}

@keyframes bounce-in {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.slide-up-enter-active {
  animation: slide-up .3s;
}

.slide-up-leave-active {
  animation: slide-up .3s reverse;
}

@keyframes slide-up {
  0% {
    opacity: 0;
    transform: translate(0, 200px);
  }
  100% {
    opacity: 1;
    transform: translate(0, 0);
  }
}

.slide-left-enter, .slide-left-leave-to {
  opacity: 0;
  transform: translateX(200px);
}

.slide-left-leave-active {
  position: absolute;
}

</style>