<template>
  <div class="cd-user-home page">
    <b-modal id="create_check_modal" centered content-class="cd-card" hide-footer hide-header>
      <div class="create-check-header text-center color-text mb-3">
        Новый чек
      </div>
      <cd-stepper
          :current="currentStep"
          :steps="[{icon: 'weekend', title: 'Тип'}, {icon: 'badge', title: 'Название'}, {icon: 'event', title: 'Дата'}]"></cd-stepper>
      <div class="create-check-options mt-2">
        <transition-group name="slide-right">
          <div v-if="currentStep === 0" key="type" class="slide w-100">
            <div class="create-check-type">
              <div class="single-check d-flex" @click="checkType = 0">
                <div class="cd-radio mr-2 mt-auto mb-auto">
                  <transition name="bounce">
                    <div v-if="checkType === 0" class="cd-radio-in">
                    </div>
                  </transition>
                </div>
                <div class="content">
                  <div class="type-title">Разовый сбор</div>
                  <div class="type-description">Подойдет, если вы собрались на один вечер и нужно разделить пару чеков
                  </div>
                </div>
              </div>
              <div class="joint-expenses d-flex mt-2">
                <div class="cd-radio mr-2 mt-auto mb-auto">
                  <transition name="bounce">
                    <div v-if="checkType === 1" class="cd-radio-in">
                    </div>
                  </transition>
                </div>
                <div class="content">
                  <div class="type-title">Совместные расходы</div>
                  <div class="type-description">Если вы поехали в путешествие, где каждый день образуются новые
                    расходы
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="currentStep === 1" key="title" class="slide w-100">
            <div class="create-check-title">
              <div class="subheader text-center mb-3">
                Придумай название
                <br>
                <span>Так, чтобы было не стыдно!</span>
              </div>
              <input v-model="checkTitle" :placeholder="titlePlaceholder" class="form-control text-center" type="text">
            </div>
          </div>
          <div v-if="currentStep === 2" key="date" class="slide w-100">
            <div class="create-check-date">
              <div class="subheader text-center mb-3">
                Укажи дату
                <br>
                <span>Умничка, если помнишь, когда это было!</span>
              </div>
              <b-datepicker v-model="checkDate" class="form-control text-center" hide-header label-help="" locale="ru"
                            no-highlight-today placeholder="Дата"/>
            </div>
          </div>
          <div v-if="currentStep === 3" key="loading" class="slide w-100">
            <div class="create-check-loading">
              <b-spinner type="grow"></b-spinner>
            </div>
          </div>
        </transition-group>
      </div>
      <div v-if="currentStep <= 2" class="create-check-next-step">
        <button id="next_step_btn" class="shadowed next-step-btn w-100 active-btn mt-3" @click="nextStep">
          {{ !(currentStep > 1) ? "Дальше!" : "Создать чек!" }}
        </button>
      </div>
    </b-modal>
    <div class="cd-card cd-user-profile text-center mt-3">
      <span class="cd-user-hello color-text">Привет, {{ CDUser.name || "Никто" }}!</span>
      <cd-avatar :user="CDUser" class="ml-auto mr-auto mt-2 mb-2"/>
      <span v-if="checks.length > 0">
        Разделен {{checks.length > 1 ? 'о' : ''}} уже {{ checks.length }} {{checksCountWord}}!
      </span>
      <span v-else>
        Время разделить первый чек!
      </span>
      <button class="w-100 mt-3 d-flex justify-content-center share-btn color-text shadowed active-btn"><i
          class="material-icons mt-auto mb-auto mr-1">share</i>Поделиться
      </button>
    </div>
    <div class="cd-user-checks mt-3">
      <div class="cd-card cd-checks-header text-center color-text">Мои чеки</div>
      <div class="cd-card checks-list-wrapper">
        <div v-if="checks.length === 0" class="checks-empty text-center">
          <span v-if="!checksLoading">
            <i class="material-icons-round color-text">outlined_flag</i>
            <br>
            Пока ничего нет...
          </span>
          <div class="checks-loading" v-else>
            <b-spinner type="grow"></b-spinner>
          </div>
        </div>
        <div v-else class="checks-list">
          <div v-for="(check, index) in checks"
               :key="index"
               :style="index < checks.length - 1 ? 'border-bottom: solid 1px var(--border)' : ''"
               class="check d-flex justify-content-between">
            <div class="info">
              {{ check.title }}
              <br>
              <span>
                {{ new Date(check.date).toLocaleDateString() }}
              </span>
            </div>
            <div class="check-actions d-flex mt-auto mb-auto">
              <div class="edit-check mr-2">
                <button class="shadowed edit-btn" @click="() => editCheck(check._id)">
                  <i class="material-icons-outlined">edit</i>
                </button>
              </div>
              <div class="results-check">
                <router-link :to="'/results/' + check._id">
                  <button class="shadowed edit-btn">
                    <i class="material-icons-outlined">visibility</i>
                  </button>
                </router-link>
              </div>
            </div>
          </div>
        </div>
        <button v-if="CDUser.name && !checksLoading"
                v-b-modal.create_check_modal
                class="active-btn add-check-btn d-flex w-100 justify-content-center mt-2 color-text shadowed">
          <i class="material-icons color-text mt-auto mb-auto mr-1">add_circle_outline</i> Новый чек
        </button>
      </div>
    </div>
    <div class="cd-card exit-account mt-3">
      <button class="exit-btn d-flex justify-content-center w-100" @click="logout">
        <i class="material-icons mr-1 mt-auto mb-auto">logout</i> Выйти
      </button>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import CdAvatar from "@/components/CdAvatar";
import CdStepper from "@/components/CdStepper";
import {APIv1, BACKEND} from "../../backend.config";
import axios from "axios";

export default {
  name: "CDUserChecks",
  components: {CdStepper, CdAvatar},
  data() {
    return {
      currentStep: 0,
      checkType: 0,
    }
  },
  computed: {
    ...mapGetters(["checks", "checksLoading", "CDUser", "checkTitle", "checkDate"]),
    checksCountWord: function () {
      let cl = this.checks.length % 10
      if ([0, 5, 6, 7, 8, 9].indexOf(cl) !== -1) {
        return "чеков"
      } else if (cl === 1) {
        return "чек"
      } else {
        return "чека"
      }
    },
    checkTitle: {
      get: function () {
        return this.$store.state.products.checkTitle
      },
      set: function (title) {
        this.$store.commit('updateTitle', title)
      }
    },
    checkDate: {
      get: function () {
        return this.$store.state.products.checkDate
      },
      set: function (date) {
        this.$store.commit('updateDate', date)
      }
    },
    titlePlaceholder() {
      return ["Лучшая тусовка в мире", "Ламповая посиделка", "Мощное собрание мощных людей", "Название", "Мега-тусовка",
        "Жесткая тусовка", "Супер-пупер-туса", "Лучше это не вспоминать", "Мама сказала много не пить", "Мамины тусовщики",
        "Тусовка б̶̶̶е̶̶̶з̶̶̶ ̶а̶л̶к̶о̶г̶о̶л̶я̶"][Math.floor(Math.random() * 11)]
    },
  },
  methods: {
    ...mapActions(["fetchChecks", "setCDID", "clearCDUser"]),
    nextStep() {
      const showWrong = () => {
        let btn = document.getElementById("next_step_btn")
        btn.classList.add("next-btn-wrong")
        setTimeout(() => {
          btn.classList.remove("next-btn-wrong")
        }, 300)
      }
      if (this.currentStep === 1) {
        if (this.checkTitle.trim().length > 0) {
          this.currentStep++
        } else {
          showWrong()
        }
      } else if (this.currentStep === 2) {
        if (this.checkDate) {
          this.currentStep++
          this.$router.push("/addusers")
        } else {
          showWrong()
        }
      } else {
        this.currentStep++
      }
    },
    logout() {
      axios.get(BACKEND + APIv1 + "/logout").then(() => {
        this.clearCDUser()
        this.$router.push("/")
      })
    },
    editCheck(cdid) {
      axios.get(BACKEND + APIv1 + "/checks/edit/" + cdid).then(r => {
        let checkData = r.data
        this.$store.commit("updateCDID", checkData._id)
        this.$store.commit("updateProducts", checkData.products)
        this.$store.commit("updateUsers", checkData.users)
        this.$router.push("/addusers")
      })
    }
  },
  mounted() {
    if (this.CDUser._id){
      this.fetchChecks()
    }
  }
}
</script>

<style lang="scss" scoped>
.cd-user-home {
  padding: 0 16px;
}

.cd-user-hello {
  font-size: 1.3em;
  font-weight: 500;
}

.share-btn {
  padding: 6px 8px;
  border: none;
  outline: none;
  border-radius: 20px;
  background-color: var(--btn-background);
}

.cd-checks-header {
  border-radius: 15px 15px 0 0 !important;
  font-size: 24px;
  font-weight: 500;
}

.checks-list-wrapper {
  border-radius: 0 0 15px 15px !important;
  max-height: 50vh;
  overflow-y: auto;
}

.checks-empty {
  span {
    i {
      font-size: 60px;
      color: var(--main);
    }

    font-weight: 400;
    font-size: 18px;
  }
}

.add-check-btn {
  padding: 6px 8px;
  border: none;
  outline: none;
  border-radius: 20px;
  background-color: var(--btn-background);

}

.exit-btn {
  border: none;
  padding: 6px 8px;
  outline: none;
  border-radius: 20px;
  background-color: var(--wrong);
  color: white;
}

.exit-btn:active {
  box-shadow: 0 0 15px 5px rgba(255, 0, 30, 0.3) !important;
}

.create-check-header {
  font-size: 1.4em;
  font-weight: 500;
}

.next-step-btn {
  padding: 6px 8px;
  border: none;
  outline: none;
  border-radius: 20px;
  background-color: var(--main);
  color: white;
  font-weight: 500;
}

.next-step-btn:disabled {
  opacity: 0.5;
}

.create-check-type, .create-check-title, .create-check-date, .create-check-loading {
  min-height: 135px;
}

.joint-expenses {
  * {
    opacity: 0.5;
  }
}

.joint-expenses::after {
  content: "Уже разрабатывается!";
  position: absolute;
  width: 100%;
  text-align: center;
  margin-top: 30px;
  opacity: .8;
  color: var(--main);
}

.type-description {
  font-size: 0.8em;
  color: var(--text-secondary);
}

.subheader {
  font-weight: 500;
  font-size: 1.1em;
  line-height: 1.1;

  span {
    font-size: 0.7em;
    font-weight: 400;
  }
}

.create-check-loading, .checks-loading {
  text-align: center;

  span {
    margin-top: 45px;
    color: var(--main);
    position: relative;
  }
}

.checks-loading{
  span{
    margin: 10px 0 10px 0;
  }
}

.check {
  padding: 8px 0;

  .info {
    line-height: 1.1;

    span {
      font-size: 0.8em;
      color: var(--text-secondary);
    }
  }
}

.edit-btn {
  border: none;
  outline: none;
  padding: 5px;
  background-color: var(--btn-background);
  border-radius: 50px;
  display: flex;

  i {
    font-size: 20px;
    margin-top: auto;
    margin-bottom: auto;
    color: var(--main);
  }
}
</style>

<style lang="scss">
.dropdown-menu.show {
  background-color: var(--btn-background);
}

.btn-primary:not(:disabled):not(.disabled):active, .btn-primary:not(:disabled):not(.disabled).active, .show > .btn-primary.dropdown-toggle {
  background-color: var(--main);
}

.btn-primary.focus, .btn-primary:focus {
  box-shadow: 0 0 15px 5px rgba(255, 0, 30, 0) !important;
}

.b-form-btn-label-control {
  button {
    color: var(--main) !important;
  }
}

.text-muted {
  color: #dbdbdb !important;
}

.btn-outline-secondary:hover {
  background-color: var(--btn-background) !important;
  outline: none;
}
</style>