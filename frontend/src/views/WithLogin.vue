<template>
  <div class="vklogin page">
    <div class="cd-card text-center vk-login-card">
      <div class="login-header mb-2">
        Логинимся через {{type === "vk" ? "ВК" : type === "ya" ? "Яндекс" : type === "gl"? "Google": "что-то"}}
      </div>
      <transition-group name="slide-left">
        <div class="login-process" v-if="!loginError" key="prc">
          Общаемся с Илоном и обсуждаем возможность логина через {{type === "vk" ? "ВК" : type === "ya" ? "Яндекс" : type === "gl"? "Google": "что-то"}} <br>
          Ничего не делай, нужно просто подождать :)
          <div class="login-spinner mt-4 mb-3">
            <b-spinner type="grow" class="color-text">
            </b-spinner>
          </div>
        </div>
        <div class="login-failed" v-else key="fld">
          Не залогинилось...
          Расскажи, пожалуйста, что пошло не так и скинь скрин этого экрана
          <br>
          <a href="https://vk.com/siailya">(напиши сюда)</a>
          <br>
          <code>
            {{loginError}}
          </code>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {APIv1, BACKEND} from "../../backend.config";
import {mapActions, mapGetters} from "vuex";
const jwt = require("jsonwebtoken")

export default {
  name: "VKLogin",
  data () {
    return {
      loginError: null,
      type: ""
    }
  },
  methods: {
    ...mapActions(["fetchChecks"])
  },
  computed: {
    ...mapGetters(["CDUser"])
  },
  mounted() {
    if (this.CDUser.name) {
      this.$router.push("/")
    } else {
      if (this.$route.path === "/vk") {
        this.type = "vk"
        axios.post(BACKEND + APIv1 + "/login/vk", {code: this.$route.query.code})
        .then(r => {
          let cduser = jwt.decode(r.data.token).user
          this.$store.commit("updateCDUser", cduser)
          this.$router.push("/home")
          this.fetchChecks()
        })
        .catch(r => {
          console.log(r)
          this.loginError = JSON.stringify(r.response.data)
        })
      } else if (this.$route.path === "/ya") {
        this.type = "ya"
        axios.post(BACKEND + APIv1 + "/login/ya", {token: this.$route.hash.substr(14, this.$route.hash.indexOf("&") - 14)})
            .then(r => {
              let cduser = jwt.decode(r.data.token).user
              this.$store.commit("updateCDUser", cduser)
              this.$router.push("/home")
              this.fetchChecks()
            })
            .catch(r => {
              console.log(r)
              this.loginError = JSON.stringify(r.response.data)
            })
      } else if (this.$route.path === "/gl") {
        this.type = "gl"
        axios.post(BACKEND + APIv1 + "/login/gl", {code: this.$route.query.code})
            .then(r => {
              let cduser = jwt.decode(r.data.token).user
              this.$store.commit("updateCDUser", cduser)
              this.$router.push("/home")
              this.fetchChecks()
            })
            .catch(r => {
              console.log(r)
              this.loginError = JSON.stringify(r.response.data)
            })
      } else {
        this.router.push("/")
      }
    }
  }
}
</script>

<style scoped lang="scss">
.vklogin{
  padding: 16px;
}

.vk-login-card{
  margin-top: 30vh;
  color: var(--text-color);
  .login-header{
    font-size: 1.3em;
    font-weight: 500;
    color: var(--main);
  }
  a{
    color: var(--text-secondary);
    text-decoration: underline;
  }
}
</style>