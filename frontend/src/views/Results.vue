<template>
  <div class="results page">
    <b-modal id="user_modal" content-class="cd-card" centered hide-header hide-footer>
      <div class="header text-center">Подробности о пользователе {{activeUser.name}}</div>
      <div class="subheader text-center font-weight-light">
        Внутренние операции пользователя
      </div>
      <div class="user-modal-products">
        <div class="modal-product d-flex justify-content-between mb-1 mt-1 p-1" style="border-bottom: #696969 1px solid" v-for="product in activeUser.products" :key="product.product_id">
          <div class="main-info">
            {{productById(product.product_id).title}}
            <div class="payed-by">Оплатил(а) {{users.find(user => {return user.id === productById(product.product_id).payed}).name}}</div>
          </div>
          <div class="amount-info mt-auto mb-auto">
            {{product.amount}} ₽
          </div>
        </div>
        <div class="modal-product d-flex justify-content-between mb-1 mt-1 p-1">
          <div class="main-info" style="font-size: 1.3em">
            Всего
          </div>
          <div class="amount-info mt-auto mb-auto" style="font-size: 1.3em">
            {{activeUser.products.map(product => {return product.amount}).reduce((a, b) => a + b, 0).toFixed(2)}} ₽
          </div>
        </div>
      </div>
    </b-modal>
    <div class="cd-card results-header mt-3 text-center">
      <div class="content">
        Результаты
        <div class="results-subheader" v-if="!fromURL">
          Ну наконец-то!
        </div>
        <div class="check-info mt-1" v-else>
          Чек "{{checkTitle}}", который создал {{CDUser.name}} {{new Date(checkDate).toLocaleDateString("ru")}}
        </div>
      </div>
    </div>
    <div class="cd-card results-wrapper mb-3">
      <div class="mode-buttons d-flex justify-content-around" :class="onboarding === 0 ? 'mode-btn-onb' : ''">
        <div class="slider" id="slider"></div>
        <div class="who-whom w-100">
          <button class="who-whom-btn w-100" id="who_whom_btn" style="color: var(--main)" @click="toggleMode(0)">Кто - кому</button>
        </div>
        <div class="whom-who w-100">
          <button class="whom-who-btn w-100" id="whom_who_btn" @click="toggleMode(1)">Кому - кто</button>
        </div>
      </div>
      <transition-group :name="mode === 0 ? 'change-mode-zero' : 'change-mode-one'" tag="div" class="mt-3">
        <div key="mode0" class="results-container change-mode-item" v-if="mode === 0">
          <div class="empty-results" v-if="users.length > 1 && Object.keys(whom_who).length === 0">
            <i class="material-icons-round color-text">tungsten</i>
            <br>
            Никого нет!
          </div>
          <div class="who-cell-wrapper" v-for="user in users" :key="user.id" @click="() => {showUserMore(user); onboardingNext()}">
            <div class="cd-card who-cell mt-3 w-100 text-center" :class="onboarding === 1 ? 'user-card-onb' : ''" v-if="users.length > 1 && Object.keys(who_whom[user.id]).map((key) => {return [key, who_whom[user.id][key]]}).filter((item) => {return item[1] !== 0 && parseInt(item[0]) !== user.id}).length > 0">
              <span class="user">Пользователь {{userById(user.id).name}} должен</span>
              <div class="who-whom-cell-wrapper" v-for="(amount, who, index) in who_whom[user.id]" :key="index">
                <div class="who-whom-cell text-left" v-if="(parseInt(who) !== user.id) && (amount > 0)">
                  {{userById(parseInt(who)).name}} - {{amount.toFixed(2)}} ₽
                </div>
              </div>
            </div>
            <div class="cd-card who-cell mt-3 w-100 text-center" v-else>
              <span class="user">Пользователь {{userById(user.id).name}} должен</span>
              <div class="who-whom-cell text-center">
                А никому он ничего не должен. Живет как хочет
                <br>
                <i class="material-icons">thumb_up_off_alt</i>
              </div>
            </div>
          </div>
        </div>
        <div key="mode1" class="results-container change-mode-item" v-if="mode === 1">
          <div class="empty-results" v-if="Object.keys(whom_who).length === 0">
            <i class="material-icons-round color-text">tungsten</i>
            <br>
            Никого нет!
          </div>
          <div class="whom-cell-wrapper" v-for="payer in payers" :key="payer">
            <div class="cd-card whom-cell mt-3 w-100 text-center" v-if="Object.values(Object.keys(whom_who[payer]).map((key) => {return parseInt(key) !== payer ? whom_who[payer][key] : 0})).reduce((a, b) => a + b, 0)">
              <span class="user">Пользователю {{userById(payer).name}} должны</span>
              <div class="whom-who-cell-wrapper" v-for="(amount, whom, index) in whom_who[payer]" :key="index">
                <div class="whom-who-cell text-left" v-if="parseInt(whom) !== payer && amount > 0">
                  {{userById(parseInt(whom)).name}} - {{amount.toFixed(2)}} ₽
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition-group>
    </div>
<!--    <div class="fromurl-edit cd-card" v-show="fromURL">-->
<!--      <button class="edit-url-btn d-flex w-100 justify-content-center" @click="$router.push('/addusers')">-->
<!--        <i class="material-icons mr-1">edit</i>-->
<!--        Редактировать-->
<!--        <span class="beta">BETA</span>-->
<!--      </button>-->
<!--    </div>-->
    <div class="cd-card share mt-3" :class="shareLink === 'Я украл ссылку!' && 'share-link-deactivated'">
      <div class="text-center share-header color-text d-flex justify-content-center">
        <div class="text-center">
          Поделись ссылкой
        </div>
        <span class="beta">BETA</span>
      </div>
      <div class="text-center share-subheader">
        Друзья смогут посмотреть результаты и сказать тебе, если что-то не так
      </div>
      <div class="share-link d-flex mt-2">
        <input class="input form-control w-100" readonly :value="shareLink"/>
        <button class="copy-link ml-2 shadowed active-btn" @click="copyLink" :disabled="shareLink === 'Я украл сслыку'">
          <i class="material-icons mt-auto mb-auto">content_copy</i>
        </button>
      </div>
    </div>

    <div class="cd-card go-home mt-3 mb-4">
      <router-link to="/home">
        <button class="to-home-btn shadowed w-100">
          Вернуться домой
        </button>
      </router-link>
    </div>

    <transition name="slide-up" appear>
      <div class="adaptive-width onboarding cd-card text-center" v-if="onboarding < 2">
        <div class="onb-header">
          Обучалочка
        </div>
        {{onboarding_text[onboarding] || ""}}
        <br>
        <button class="onb-next-btn mt-2" @click="onboardingNext()">Дальше</button>
      </div>
    </transition>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import {Base64} from 'js-base64';
import axios from "axios";
import {APIv1, BACKEND} from "../../backend.config";
Base64.extendString();

export default {
  name: "Results",
  data() {
    return {
      mode: 0,
      activeUser: {products: []},
      fromURL: false,
      onboarding: 1000,
      onboarding_text: [
          "Это панель результатов. У нее есть 2 режима: пользователи, которЫЕ должны и пользователи которЫМ кто-то должен",
          "В первом режиме можно нажать на любую карточку пользователя и посмотреть его 'Виртуальный счёт' - то, за что он должен"
      ]
    }
  },
  computed: {
    ...mapGetters(["users", "products", "payers", "who_whom", "whom_who", "userById", "productById", "CDUser", "checkTitle", "checkDate", "cdid", "checkCreated"]),
    shareLink: function () {
      if (this.cdid === null) {
        return "Я украл ссылку!"
      } else {
        return "https://checkdeli.online/results/" + this.cdid
      }
    }
  },
  methods: {
    ...mapActions(["setCDID", "calculateResults", "createNewCheck", "updateCheck"]),
    onboardingNext() {
      if (this.onboarding === 1) {
        localStorage.setItem("res-onb", "true")
      }
      let old = this.onboarding
      this.onboarding = 1000
      setTimeout(() => {
        this.onboarding = old + 1
      }, 600)
    },
    toggleMode(mode) {
      function activate(id) {
        let btn = document.getElementById(id)
        btn.style.color = "var(--main)"
      }
      function deactivate(id) {
        let btn = document.getElementById(id)
        btn.style.color = "white"
      }
      this.mode = mode

      let slider = document.getElementById("slider")
      if (this.mode === 0) {
        activate("who_whom_btn")
        deactivate("whom_who_btn")
        slider.style.transform = "translate(0, 0)"
        // slider.style.width = "60%"
      } else {
        deactivate("who_whom_btn")
        activate("whom_who_btn")
        slider.style.transform = "translate(100%, 0)"
        // slider.style.width = "60%"
      }
    },
    showUserMore(user) {
      this.activeUser = user
      this.$bvModal.show("user_modal")
    },
    copyLink() {
      navigator.clipboard.writeText("Разделенный чек можно посмотреть тут: \n\n" + this.shareLink)
    },
  },
  mounted() {
    if (localStorage.getItem("res-onb") !== "true") {
      this.onboarding = 0
    }

    if (this.$route.params.storestring) {
      this.fromURL = true
      this.$store.commit("updateCDID", this.$route.params.storestring)

      axios.get(BACKEND + APIv1 + "/checks/getbyid/" + this.$route.params.storestring).then(r => {
        this.$store.state.users.users = r.data.users
        this.$store.state.products.products = r.data.products
        this.$store.state.products.defaultPayed = r.data.defaultPayed
        this.$store.state.products.checkTitle = r.data.title
        this.$store.state.products.checkDate = r.data.date
        this.$store.state.products.checkCreated = r.data.user.name


        this.calculateResults()
      })
    }

    if ((this.CDUser.name !== undefined) && (this.$route.params.storestring === undefined)) {
      if (this.cdid === null && this.checkTitle !== "") {
        this.createNewCheck()
      } else if (this.checkTitle !== "") {
        this.updateCheck()
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import "public/colors";

.results {
  padding: 0 16px;
  overflow-x: hidden;
  min-height: 80vh;
}

.results-header{
  border-radius: 15px 15px 0 0!important;
  color: var(--main);
  font-size: 32px;
  font-weight: 500;
  overflow: hidden;
  padding: 0!important;
  .content{
    background: rgba(255, 255, 255, 0.7);
    padding: 15px 10px;
    color: var(--main);
    .check-info{
      font-size: 16px;
    }
  }
}

html[theme="dark"] {
  .content{
    background: var(--background-secondary);
  }
}

.results-subheader{
  font-size: 16px;
  font-weight: 400;
  color: var(--text-color);
}

.results-wrapper{
  border-radius: 0 0 15px 15px!important;
  min-height: 80vh;
}

.mode-buttons{
  align-items: center;
  background: rgba(160, 160, 160, 0.3);
  border-radius: 50px;
  height: 38px;
  .who-whom, .whom-who{
    padding: 4px 8px;
    z-index: 3;
  }
  button{
    color: white;
    height: 30px;
    border: none;
    outline: none;
    z-index: 2;
    background: none;
    font-weight: 500;
    transition: all .3s;
  }
  .slider{
    position: absolute;
    background-color: white;
    height: 38px;
    left: 10px;
    z-index: 1;
    border-radius: 50px;
    width: calc(50% - 10px);
    transition: all .3s;
  }
}

html[theme="glass"]{
  .slider{
    box-shadow: 0 0 10px 5px rgba($main, 0.2)!important;
    //left:
  }
}

html[theme="light"]{
  .slider{
    box-shadow: 0 0 10px 5px rgba($light_main, 0.2)!important;
  }
}

html[theme="dark"]{
  .slider{
    background: var(--background-thirdly);
    //box-shadow: 0 0 10px 5px rgba($light_dark, 0.2)!important;
  }
}

.empty-results{
  text-align: center;
  font-size: 18px;
  font-weight: 500;
  i{
    font-size: 72px;
  }
}

.who-cell, .whom-cell{
  background: rgba(255, 255, 255, 0.75) !important;
  border-radius: 15px;
  margin: 0;
  z-index: 500;
  transition: all .3s;
  .user{
    font-size: 18px;
    font-weight: 500;
    color: var(--main);
  }
  .who-whom-cell, .whom-who-cell{
    z-index: 500;
    color: var(--text-color);
    i{
      font-size: 54px;
      color: var(--main);
    }
  }
}

html[theme="dark"] {
  .who-cell, .whom-cell {
    background: var(--background-secondary)!important;
    border: solid 1px var(--border);
  }
}

.header{
  font-weight: 500;
  color: var(--text-color);
  font-size: 18px;
}

.subheader{
  font-weight: 400;
  font-size: 16px;
  color: var(--text-color);
}

.modal-product{
  color: var(--text-color);
  .payed-by{
    font-weight: 400;
    font-size: 0.7em;
  }
}

.edit-url-btn{
  border-radius: 20px;
  border: none;
  outline: none;
  background: var(--btn-background);
  padding: 6px 12px;
  font-size: 18px;
  font-weight: 500;
  color: var(--main);
  i{
    font-size: 20px;
    margin-top: auto;
    margin-bottom: auto;
  }
}

.beta{
  margin-left: 2px;
  font-size: 0.65em;
  font-weight: 400;
  color: var(--text-secondary);
  margin-bottom: auto;
}

html[theme="glass"] .share{
  background: rgba(255, 255, 255, 0.7)!important;
}
.share-header{
  font-size: 1.2em;
  font-weight: 500;
  div{
    color: var(--main);
  }
}

.share-subheader{
  color: var(--text-color);
}

.copy-link{
  border-radius: 30px;
  border: none;
  background: var(--btn-background);
  width: 40px;
  height: 40px;
  padding: 8px;
  i{
    color: var(--main);
  }
}

.notice{
  font-size: 0.7em;
  text-align: center;
  color: var(--text-secondary);
}

.share-link-deactivated{
  opacity: 0.6;
  input{
    text-align: center;
  }
}

.to-home-btn{
  color: white;
  border: none;
  outline: none;
  background-color: var(--main);
  border-radius: 50px;
  padding: 8px 6px;
  font-size: 16.5px;
  font-weight: 500;
}

.mode-btn-onb, .user-card-onb{
  overflow: visible!important;
  z-index: 10;
  transition: all .5s;
}

html[theme="light"]{
  .mode-btn-onb, .user-card-onb{
    box-shadow: 0 0 17px 21px rgba($light_main, 50%)!important;
  }
}
html[theme="dark"]{
  .mode-btn-onb, .user-card-onb{
    box-shadow: 0 0 17px 21px rgba($dark_main, 50%)!important;
  }
}
</style>

<style>
.change-mode-item {
  transition: all .2s;
  z-index: 1000;
}
.change-mode-zero-enter {
  opacity: 0;
  transform: translateX(500px);
}
.change-mode-zero-leave-active {
  position: absolute;
  width: 94%;
}
.change-mode-one-enter{
  opacity: 0;
  transform: translateX(-500px);
}
.change-mode-zero-leave-to, .change-mode-one-leave-to {
  opacity: 0;
  transform: translateY(500px);
}
.change-mode-one-leave-active {
  position: absolute;
  width: 94%;
}

</style>