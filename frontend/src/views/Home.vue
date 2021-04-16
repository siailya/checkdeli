<template>
  <div class="home-wrapper">
    <b-modal id="login_modal" content-class="cd-card" centered hide-header hide-footer>
      <div class="login-content">
        <div class="login-header text-center">
        Познакомимся?
      </div>
        <div class="login-with text-center">
          Войти через
        </div>
        <a href="https://oauth.vk.com/authorize?client_id=7803894&display=popup&redirect_uri=http://localhost:3000/vk&scope=friends&response_type=code&v=5.130">
          <div class="login-with-list d-flex justify-content-center">
            <img width="42" height="42" src="@/assets/logo_vk_color_28.svg" alt="VK">
          </div>
        </a>
        <div class="or-login text-center mt-1 mb-1">
          - или -
        </div>
        <div class="login-password">
          <input type="email" class="form-control mb-1" placeholder="Электропочта" v-model="email" @input="checkAccount">
          <input type="password" class="form-control" placeholder="Пароль" v-model="password">
          <div class="cd-card password-hints" v-if="password && !accountInBase">
            Минимум 6 знаков - <i class="material-icons-round" :style="this.passwordVerify[0] ? 'color: green' : 'color: var(--wrong)'">{{this.passwordVerify[0] ? 'done' : 'close'}}</i><br>
            Хотя бы одна заглавная буква - <i class="material-icons-round" :style="this.passwordVerify[1] ? 'color: green' : 'color: var(--wrong)'">{{this.passwordVerify[1] ? 'done' : 'close'}}</i><br>
            Хотя бы одна цифра - <i class="material-icons-round" :style="this.passwordVerify[2] ? 'color: green' : 'color: var(--wrong)'">{{this.passwordVerify[2] ? 'done' : 'close'}}</i>
          </div>
          <transition name="slide-up">
            <div class="account-info" v-if="emailVerify && email.includes('@')">
              <div class="login text-center mt-2" v-if="emailVerify && accountInBase">
                <button @click="loginNative" class="login-btn mt-1 w-100" :class="wrongPassword ? 'wrong-login' : ''">{{wrongPassword ? "Неверный пароль!" : "Войти"}}</button>
              </div>
              <div class="register text-center" v-if="emailVerify && !accountInBase">
                <input type="text" class="form-control mt-1 mb-2" placeholder="Имя" v-model="name">
                <button @click="registerNative" class="register-btn mt-1 w-100" :class="registerError ? 'wrong-login' : ''">{{registerError ? "Заполни все поля!" : "Создать аккаунт"}}</button>
              </div>
            </div>
          </transition>
        </div>
        <div class="or-login text-center mt-1 mb-1">
          - или -
        </div>
        <div class="without-login text-center" v-b-modal.confirm_without_login>
          Продолжить без регистриации
        </div>
      </div>
    </b-modal>

    <b-modal id="confirm_without_login" content-class="cd-card" centered hide-header hide-footer>
      <div class="login-header text-center">
        Точно не познакомимся?
      </div>
      <div class="without-login-text text-center">
        Без регистрации/входа не получится хранить чеки, делиться разделенным чеком с друзьями, редактировать чеки совместно и жаловаться создателю на жизнь
      </div>
      <div class="no-login-buttons d-flex mt-2">
        <router-link to="/addusers" tag="button" class="active-btn confirm-no-login w-100 mr-1 shadowed">
          Продолжить
        </router-link>
        <button class="active-btn decline-no-login w-100 ml-1 shadowed" @click="$bvModal.hide('confirm_without_login')">
          Войти
        </button>
      </div>
    </b-modal>

    <header class="page home">
      <div class="theme-changer cd-card">
        <button class="change-theme d-flex" @click="changeTheme">
          <i class="material-icons mt-auto mb-auto">{{themePic}}</i>
        </button>
      </div>
      <transition name="slide-left" appear>
        <router-link to="/home" v-if="CDUser.name !== undefined">
          <div class="cduser cd-card d-flex align-items-center">
              <div class="cdu-avatar">
                <img :src="CDUser.avatar || 'https://icotar.com/initials/~?fg=ffffff&bg=' + mainColor" alt="">
              </div>
              <div class="cdu-name">
                {{CDUser.name}}
              </div>
          </div>
        </router-link>
      </transition>
      <div class="hello cd-card">
        <h1 class="header color-text">
          Чекдели
        </h1>
        <h2 class="subheader">
          Делить чеки - просто!
        </h2>
      </div>
      <div class="buttons-wrapper">
        <div class="cd-card">
          <button @click="start" class="start active-btn">
            <span class="color-text">Начать!</span>
          </button>
        </div>
      </div>
    </header>

    <div class="waves">
      <div class="back-wave" id="back-wave"></div>
      <div class="front-wave"></div>
    </div>

    <section class="story">
      <div class="story-content page home">
        <div class="story-chapter beginning d-flex">
          <div class="text">
            <div class="story-header">
              Это Гена
            </div>
            <div class="story-text">
              Гена, как и многие, любит пару раз в месяц собраться с друзьями и под пиццу обсудить политическую ситуацию в мире
            </div>
          </div>
          <div class="image">
            <img src="../assets/story/gena1.png" alt="">
          </div>
        </div>
        <div class="story-chapter middle d-flex">
          <div class="image">
            <img src="../assets/story/gena2.png" alt="">
          </div>
          <div class="text">
            <div class="story-header">
              Но...
            </div>
            <div class="story-text">
              Но Гена устал считать в Excel кто и сколько ему должен. Особенно, когда платит не только он
            </div>
          </div>
        </div>
        <div class="story-chapter end d-flex">
          <div class="text">
            <div class="story-header">
              А потом
            </div>
            <div class="story-text">
              Потом Гена нашел Чекдели и понял, что делить чеки просто! Вот твой чек, где все видно. Гена, на.
            </div>
          </div>
          <div class="image">
            <img src="../assets/story/gena3.png" alt="">
          </div>
        </div>
      </div>
      <div class="d-flex justify-content-center">
        <button @click="start" class="start-story active-btn mb-2">
          Хочу как Гена!
        </button>
      </div>
      <div class="omg-crocodile text-center pb-3">
        <a href="https://www.youtube.com/watch?v=W7caMnPB-6A">Аааа! Крокодил в Чекдели!</a>
      </div>
    </section>

    <section class="features page home">
      <h1 class="features-header text-center color-text">Как разделить чеки?</h1>
      <h2 class="features-subheader text-center mt-1">Всего простых 3 шага!</h2>
      <div class="steps">
        <div class="step first-step mt-5">
          <div class="step-info">
            <div class="step-counter">
              1
            </div>
            <div v-tilt="{max: 5, glare: true}" class="step-text cd-card">
              <h3>Добавляй людей</h3>
              <div class="step-description">
                Добавляй всех, кто был с тобой и что-то пил или ел. Не добавляй тех, кто не любит пиццу!
              </div>
            </div>
          </div>
        </div>
        <div class="step second-step">
          <div class="step-info">
            <div class="step-counter">
              2
            </div>
            <div v-tilt="{max: 5, glare: true}" class="step-text cd-card">
              <h3>Добавляй позиции</h3>
              <div class="step-description">
                Укажи пользователей под каждой позицией из чека и выбери того, кто ее оплатил
              </div>
            </div>
          </div>
        </div>
        <div class="step third-step">
          <div class="step-info">
            <div class="step-counter">
              3
            </div>
            <div v-tilt="{max: 5, glare: true}" class="step-text cd-card">
              <h3>Проверяй результаты</h3>
              <div class="step-description">
                Чекдели сам посчитает, кто сколько и кому должен. Да, даже если платил не один человек!
              </div>
            </div>
          </div>
        </div>
        <div class="step fourth-step лол_какой_четвертый_это_же_3.1">
          <div class="step-info">
            <div class="step-counter">
              3.1
            </div>
            <div v-tilt="{max: 5, glare: true}" class="step-text cd-card">
              <h3>Делись с друзьями</h3>
              <div class="step-description">
                Отправляй друзьям ссылку, чтобы каждый проверил лично, и можно начинать заново!
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="for-what">
      <div class="for-what-content page home">
        <h1 class="for-what-header text-center color-text">Зачем нужен Чекдели?</h1>
        <h2 class="for-what-subheader text-center">Действительно. Зачем? И для кого?</h2>
        <div v-tilt="{max: 5, glare: true}" class="fw already cd-card">
          <img src="../assets/stopwatch.png" alt="">
          <h3>Для тех, кто хочет сейчас</h3>
          <div>Нужен только телефон и чуть-чуть интернета!</div>
        </div>
        <div v-tilt="{max: 5, glare: true}" class="fw big cd-card">
          <img src="../assets/people.png" alt="">
          <h3>Для больших компаний</h3>
          <div>Трудно вспомнить, кто что ел? Не беда!</div>
        </div>
        <div v-tilt="{max: 5, glare: true}" class="fw calc cd-card">
          <img src="../assets/calc.png" alt="">
          <h3>Для тех, кто устал считать</h3>
          <div>Никаких калькуляторов и Excel!</div>
        </div>

        <div class="d-flex justify-content-center">
          <button @click="start" class="start-story active-btn mb-2">
            Попробуй!
          </button>
        </div>
      </div>
    </section>

    <footer class="footer text-center p-3">
      <div class="checkdeli color-text">
        Чекдели -
        <br>
        делить чеки просто!
      </div>
      <div class="contacts mt-2 mb-2">
        По всем вопросам, предложениям и жалобам - <a href="https://vk.com/overcreated">vk.com/overcreated</a>
      </div>
      <div class="copy">
        &copy; 2021 Чекдели
      </div>
      <div class="cd-info">
        <a href="https://vk.com/overcreated" class="madeby align-items-center">Сделано {{["overcreated", "siailya"][Math.floor(Math.random() * 2)]}} c <i class="material-icons" style="color: var(--wrong); font-size: 15px">favorite</i></a>
        <div class="ver">v1.2.0a</div>
      </div>
    </footer>
  </div>
</template>

<script>
import {mapActions} from "vuex";
import {mapGetters} from "vuex";
import axios from "axios";
import {APIv1, BACKEND} from "../../backend.config";
import debounce from "debounce";
import jwt from "jsonwebtoken";

export default {
  name: 'Home',
  data() {
    return{
      theme: 1,
      themePic: "dark_mode",
      email: "",
      password: "",
      name: "",
      accountInBase: true,
      wrongPassword: false,
      registerError: false
    }
  },
  computed: {
    ...mapGetters(["CDUser"]),
    themeIcon() {
      if (document.documentElement.getAttribute("theme") === "glass") {
        return "light_mode"
      } else {
        return "science"
      }
    },
    mainColor() {
      return window.getComputedStyle(document.documentElement).getPropertyValue('--main').replace("#", "").replace(" ", "")
    },
    emailVerify: function () {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(this.email).toLowerCase())
    },
    passwordVerify: function () {
      let len = false
      let upperCase = false
      let digits = false
      if (this.password.length > 6) len = true
      if (/[A-ZА-Я]+/.test(this.password)) upperCase = true
      if (/\d+/.test(this.password)) digits = true

      return [len, upperCase, digits]
    }
  },
  beforeRouteLeave(to, from, next) {
    window.removeEventListener("scroll", this.listenScroll)
    next()
  },
  methods: {
    ...mapActions(["fetchChecks"]),
    changeTheme() {
      if (this.theme % 2 === 0){
        document.documentElement.setAttribute("theme", "dark")
        this.themePic = "dark_mode"
      } else if (this.theme % 2 === 1) {
        document.documentElement.setAttribute("theme", "light")
        this.themePic = "light_mode"
      }
      this.theme += 1
    },
    checkAccount: debounce(function () {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      if (re.test(String(this.email).toLowerCase())) {
        axios.post(BACKEND + APIv1 + "/checkaccount", {email: this.email}).then(r => {
          if (r.data === 0) {
            this.accountInBase = false
          } else {
            this.accountInBase = true
          }
        })
      }
    }, 1000, true),
    start() {
      if (this.CDUser._id) {
        this.$router.push("/home")
      } else {
        this.$bvModal.show("login_modal")
      }
    },
    listenScroll () {
      let back = document.getElementById("back-wave")
      back.style.transform = `translateY(${window.pageYOffset / 15}px)`
    },
    loginNative () {
      axios.post(BACKEND + APIv1 + "/login/native", {type: "native", name: this.name, email: this.email, password: this.password}).then(r => {
        console.log(r.data)
        console.log(jwt.decode(r.data.token))
        if (r.data.status === "User login successful!") {
          this.$store.commit("updateCDUser", jwt.decode(r.data.token).user)
          this.$router.push("/home")
          this.fetchChecks()
        } else {
          this.wrongPassword = true
          setTimeout(() => {
            this.wrongPassword = false
          }, 5000)
        }
      })
    },
    registerNative () {
      if (this.email && this.password && this.name && this.passwordVerify.every(e => e === true)) {
        axios.post(BACKEND + APIv1 + "/register/native", {type: "native", name: this.name, email: this.email, password: this.password}).then(r => {
          this.$store.commit("updateCDUser", jwt.decode(r.data.token).user)
          this.$router.push("/home")
        })
      } else {
        this.registerError = true
        setTimeout(() => {
          this.registerError = false
        }, 5000)
      }
    }
  },
  mounted() {
    window.addEventListener("scroll", this.listenScroll)
  },
}
</script>

<style scoped lang="scss">
.theme-changer{
  position: absolute;
  top: 20px;
  right: 16px;
  padding: 5px!important;
  margin: 0!important;
  border-radius: 50px!important;
}

.change-theme{
  color: var(--main);
  width: 30px;
  height: 30px;
  padding: 0!important;
  background: none;
  border: none;
  outline: none;
  transition: all .3s;
  justify-content: center;
}

.cduser{
  padding: 0 10px 0 0 !important;
  border-radius: 100px!important;
  position: absolute;
  top: 20px;
  left: 16px;
}

.cdu-avatar{
  border-radius: 50px;
  width: 42px;
  height: 42px;
  overflow: hidden;
  object-fit: contain;
  img{
    height: 100%;
  }
}

.cdu-name{
  color: var(--text-color);
  margin-top: auto;
  margin-bottom: auto;
  margin-left: 10px;
}

.home{
  text-align: center;
  padding: 0 16px;
}

.hello{
  margin-top: 20vh!important;
  padding: 2vh!important;
  border-radius: 20px!important;
}

.header{
  font-size: 64px;
  font-weight: 500;
}

.subheader{
  font-weight: 400;
  font-size: 20px;
  color: var(--text-color);
}

.buttons-wrapper{
  margin-top: 4vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.buttons-wrapper{
  div{
    border-radius: 50px!important;
  }
}

.start, .about, .start-story{
  border-radius: 30px;
  padding: 8px 20px;
  font-size: 20px;
  color: var(--main);
  border: none;
  outline: none;
  background: white;
  transition: all ease-in-out .3s;
}

html[theme="dark"]{
  .start, .about{
    background: var(--background-secondary);
  }
}

.start:hover, .about:hover, .start-story:hover{
  opacity: 0.7;
}

.story{
  background-color: var(--background-secondary);
  z-index: 10;
  padding-top: 6vh;
}

.start-story{
  background-color: var(--main);
  color: white!important;
}

.waves{
  width: 100vw;
  margin-top: 12vh;
  position: relative;
  left: 0;
  z-index: -1000;
}

.front-wave{
  background-color: var(--background-secondary);
  mask-image: url("../assets/waves/front-wave.svg");
  -webkit-mask-image: url("../assets/waves/front-wave.svg");
  mask-repeat: repeat-x;
  -webkit-mask-repeat: repeat-x;
  height: 15vh;
  background-position: bottom;
  mask-position: bottom;
  -webkit-mask-position: bottom;
  animation: wave 8s infinite cubic-bezier(0.4, 0.4, 0.4, 0.4), wave-translation 3s infinite;
  margin-bottom: -2px;
}

.back-wave{
  background-color: var(--background-thirdly);
  mask-image: url("../assets/waves/back-wave.svg");
  -webkit-mask-image: url("../assets/waves/back-wave.svg");
  mask-repeat: repeat-x;
  -webkit-mask-repeat: repeat-x;
  height: 15vh;
  background-position: bottom;
  mask-position: bottom;
  -webkit-mask-position: bottom;
  position: relative;
  top: 13vh;
  animation: wave 5s infinite cubic-bezier(0.5, 0.4, 0.4, 0.5);
}

@keyframes wave {
  0% {
    mask-position: bottom;
    -webkit-mask-position: bottom;
  }

  100% {
    mask-position: 100vw bottom;
    -webkit-mask-position: 100vw bottom;
  }
}

@keyframes wave-translation {
  0%, 100% {
   transform: translateY(0);
  }

  50%{
   transform: translateY(5px);
  }
}

.story-chapter{
  padding: 15px 0;
  .text{
    margin: auto;
    .story-header{
      font-size: 1.5em;
      font-weight: 500;
    }
  }
  .image{
    img{
      width: 90%;
    }
  }
}

.story-chapter.beginning, .story-chapter.end{
  text-align: right;
}

.story-chapter.middle{
  text-align: left;
}

.omg-crocodile{
  font-size: 0.7em;
  opacity: 0.3;
  a{
    color: var(--text-color)!important;
    text-decoration: underline;
  }
}

.features{
  padding: 16px;
}

.features-header, .for-what-header{
  font-size: 2em;
  margin: 0;
  color: var(--text-color)
}

.features-subheader, .for-what-subheader{
  font-size: 1.2em;
  font-weight: 400;
}

.steps{
  h3{
    font-size: 1.2em;
    color: var(--main);
  }
}

.step {
  margin-bottom: 6vh;
  .step-info {
    display: flex;

    .step-counter{
      display: flex;
      justify-content: center;
      padding: 10px;
      border-radius: 50px;
      background-color: var(--main);
      min-width: 50px;
      height: 50px;
      align-items: center;
      margin: auto 20px auto 0;
      color: white;
      font-size: 1.3em;
      font-weight: 500;
    }

    .step-text{
      width: 100%;
    }
  }
  text-align: left;
}

//.step-counter::after{
//  content: "";
//  width: 3px;
//  height: 130px;
//  background-color: var(--main);
//  display: block;
//  color: white;
//  z-index: -1;
//  position: absolute;
//  margin-top: 170px;
//}

.fourth-step{
  .step-counter::after{
    content: none;
  }
}

.for-what{
  padding: 16px 0;
  background-color: var(--background-secondary);
}

.fw{
  margin: 3vh;
  img{
    width: 25%;
  }
  h3{
    font-size: 1.5em;
    margin: 0;
  }
}

.checkdeli{
  font-size: 1.3em;
  font-weight: 500;
  line-height: 1.1;
}

.contacts{
  a{
    color: var(--text-color);
  }
}

.madeby, .ver{
  color: var(--text-color);
}

.ver{
  opacity: 0.7;
  font-weight: 300;
}

.login-header{
  font-size: 20px;
  font-weight: 500;
  color: var(--main);
}

.about-subheader{
  font-weight: 500;
}

.login-with, .or-login{
  color: var(--text-color);
}

.without-login{
  color: var(--main);
  outline: none;
  text-decoration: underline;
}

.decline-no-login, .confirm-no-login{
  background: var(--btn-background);
  color: var(--main);
  border: none;
  outline: none;
  border-radius: 30px;
  padding: 6px 8px;
}

.decline-no-login{
  background-color: var(--main);
  color: white;
}

.password-hints{
  font-size: 12px;
  i{
    font-size: 15px;
  }
}

.login-btn, .register-btn{
  background: var(--main);
  color: white;
  padding: 8px 6px;
  border-radius: 50px;
  border: none;
  outline: none;
  font-size: 16px;
  font-weight: 500;
  transition: all .3s;
}

.wrong-login{
  background: var(--wrong);
}

.wrong-login:active{
  animation: wrong .5s infinite;
}
</style>
