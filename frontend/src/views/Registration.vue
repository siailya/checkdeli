<template>
  <div class="registration page">
    <b-spinner type="grow" class="absolute-spinner" v-if="regprocess"></b-spinner>
    <div class="cd-card mt-3 text-center">
      <div class="reg-header">
        Регистрация
      </div>
      <div class="reg-subheader mb-3">
        Давай подружимся!
      </div>
      <div class="d-flex login-with-box justify-content-center mb-2">
        <a href="https://oauth.vk.com/authorize?client_id=7803894&display=popup&redirect_uri=https://checkdeli.online/vk&scope=friends&response_type=code&v=5.130">
          <div class="login-with-list d-flex justify-content-center">
            <img width="35" height="35" src="@/assets/logo_vk_color_28.svg" alt="VK">
          </div>
        </a>
        <a class="mr-2 ml-2" href="https://oauth.yandex.ru/authorize?response_type=token&client_id=a3e43d83e5cd49e391b7b3f01fc526b0">
          <div class="login-with-list d-flex justify-content-center">
            <img width="35" height="35" src="@/assets/ya_logo.png" alt="Yandex">
          </div>
        </a>
        <a href="https://accounts.google.com/o/oauth2/auth?client_id=755018470764-mqm8s4o88prusrn10l0a5g7kglje1led.apps.googleusercontent.com&redirect_uri=https://checkdeli.online/gl&response_type=code&scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile">
          <div class="login-with-list d-flex justify-content-center">
            <img width="35" height="35" src="@/assets/google_logo.png" alt="Google">
          </div>
        </a>
      </div>
      <div class="content">
        <b-form @submit="registerNative">
          <p class="additive">Обязательно <span style="color: var(--wrong)">*</span></p>
          <input type="email" class="form-control mb-1" required placeholder="Электропочта" v-model="email">
          <input type="password" class="form-control mb-1" required placeholder="Пароль" v-model="password">
          <input type="password" class="form-control" required placeholder="Повтор пароля" v-model="re_password">
          <div class="cd-card password-hints mt-1 mb-2">
            <p class="d-flex align-items-center"><i class="material-icons-round mr-1" :style="passwordVerify[0] ? 'color: green' : 'color: var(--wrong)'">{{passwordVerify[0] ? 'done' : 'close'}}</i> Минимум 6 знаков</p>
            <p class="d-flex align-items-center"><i class="material-icons-round mr-1" :style="passwordVerify[1] ? 'color: green' : 'color: var(--wrong)'">{{passwordVerify[1] ? 'done' : 'close'}}</i> Хотя бы одна заглавная буква</p>
            <p class="d-flex align-items-center"><i class="material-icons-round mr-1" :style="passwordVerify[2] ? 'color: green' : 'color: var(--wrong)'">{{passwordVerify[2] ? 'done' : 'close'}}</i> Хотя бы одна цифра</p>
            <p class="d-flex align-items-center"><i class="material-icons-round mr-1" :style="passwordVerify[3] ? 'color: green' : 'color: var(--wrong)'">{{passwordVerify[3] ? 'done' : 'close'}}</i> Пароли совпадают</p>
          </div>
          <input type="name" class="form-control mb-1" required placeholder="Имя" v-model="name">
          <p class="additive">Дополнительно</p>
          <input type="surname" class="form-control mb-1" placeholder="Фамилия" v-model="surname">
          <input type="pandomq" class="form-control mb-1" :placeholder="randomq" v-model="catsdogs">
          <p class="randomq-desc">
            Это не секретный вопрос и не кодовое слово. Раз уже решили познакомиться, то давай!
          </p>
<!--          <input type="birth" class="form-control" required placeholder="Дата рождения" v-model="birth_date">-->
          <div class="finalize-registration mt-3">
            <button type="submit" class="reg-btn w-100" :disabled="!(emailVerify && passwordConditions && name)" :class="registerError ? 'wrong-login' : ''">{{errorDescription || (registerError ? "Заполни все поля!" : "Создать аккаунт")}}</button>
          </div>
        </b-form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {APIv1, BACKEND} from "../../backend.config";
import jwt from "jsonwebtoken";

export default {
  name: "Registration",
  data() {
    return {
      email: "",
      password: "",
      re_password: "",
      name: "",
      surname: "",
      catsdogs: "",
      randomq: ["Кошки или собаки?", "Твой любимый цвет?", "Любимый жанр музыки?"][Math.floor(Math.random() * 3)],
      registerError: "",
      regprocess: false,
      errorDescription: ""
    }
  },
  computed: {
    passwordVerify() {
      return this.pwd()
    },
    emailVerify() {
      return this.emv()
    },
    passwordConditions() {
      return this.pwd().every(c => {return c === true})
    }
  },
  methods: {
    pwd: function () {
      let len = false
      let upperCase = false
      let digits = false
      let repeat = false
      if (this.password.length > 6) len = true
      if (/[A-ZА-Я]+/.test(this.password)) upperCase = true
      if (/\d+/.test(this.password)) digits = true
      repeat = (this.password === this.re_password && this.password !== "")

      return [len, upperCase, digits, repeat]
    },
    emv: function () {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(this.email).toLowerCase())
    },
    registerNative (e) {
      e.preventDefault()
      if (this.email && this.password && this.name && this.passwordVerify.every(e => e === true)) {
        this.regprocess = true
        axios.post(BACKEND + APIv1 + "/register/native", {type: "native", name: this.name, email: this.email, password: this.password})
        .then(r => {
          this.$store.commit("updateCDUser", jwt.decode(r.data.token).user)
          this.$router.push("/home")
        })
        .catch(() => {
          this.regprocess = false
          this.registerError = true
          this.errorDescription = "Уже существует аккаунт с такой почтой!"
          setTimeout(() => {
            this.registerError = false
            this.errorDescription = ""
          }, 3000)
        })
      } else {
        this.registerError = true
        setTimeout(() => {
          this.registerError = false
        }, 5000)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.registration{
  padding: 0 16px;
  margin-top: 10vh;
}

.reg-header{
  color: var(--main);
  font-size: 32px;
  font-weight: 500;
  overflow: hidden;
  padding: 0!important;
}

.additive{
  text-align: left;
  text-transform: uppercase;
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: 500;
  margin-top: 12px;
  margin-bottom: 6px;
 }

.password-hints{
  text-align: left;
  font-size: 12px;
  p{
    margin-bottom: 0;
  }
  i{
    font-size: 15px;
  }
}

.randomq-desc{
  font-size: 10px;
  color: var(--text-secondary);
  padding: 0;
}

.reg-btn{
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

.reg-btn:disabled{
  opacity: 0.7;
}

.absolute-spinner{
  position: absolute;
  z-index: 10;
  color: var(--main);
  top: 45%;
  width: 10vw;
  height: 10vw;
  left: 45%;
}
</style>