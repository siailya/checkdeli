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
        <div class="login-with-list d-flex justify-content-center">
          <img width="42" height="42" @click="() => loginVK([$bvModal, $router])" src="@/assets/logo_vk_color_28.svg" alt="VK">
        </div>
        <div class="or-login text-center mt-1 mb-1">
          - или -
        </div>
        <div class="login-password">
          <input type="email" class="form-control mb-1" placeholder="Электропочта" v-model="email" @input="checkAccount">
          <input type="password" class="form-control" placeholder="Пароль" v-model="password">
          <div class="account-info" v-if="email"></div>
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
    <section class="page home">
      <div class="theme-changer cd-card">
        <button class="change-theme d-flex" @click="changeTheme">
          <i class="material-icons mt-auto mb-auto">{{themePic}}</i>
        </button>
      </div>
      <transition name="slide-left" appear>
        <router-link to="/home" v-if="CDUser.name !== undefined">
          <div class="cduser cd-card d-flex align-items-center">
              <div class="cdu-avatar">
                <img :src="CDUser.avatar" alt="">
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
        <div class="cd-card mr-1">
          <button @click="start" class="start active-btn">
            <span class="color-text">Начать!</span>
          </button>
        </div>
        <div class="cd-card ml-1">
          <button @click="$router.push('/intro')" class="about active-btn">
            <span class="color-text">?</span>
          </button>
        </div>
      </div>
    </section>

    <div class="waves">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="var(--border)" fill-opacity="1" d="M0,224L80,234.7C160,245,320,267,480,229.3C640,192,800,96,960,80C1120,64,1280,128,1360,160L1440,192L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path></svg>
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
            <img src="../assets/gena1.png" alt="">
          </div>
        </div>
        <div class="story-chapter middle d-flex">
          <div class="image">
            <img src="../assets/gena2.png" alt="">
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
            <img src="../assets/gena3.png" alt="">
          </div>
        </div>
        АААА КРОКОДИЛ В ЧЕКДЕЛИ
      </div>
    </section>
<!--    <div class="fixed-bottom">-->
<!--      <a href="https://vk.com/overcreated" class="madeby align-items-center">Сделано {{["overcreated", "siailya"][Math.floor(Math.random() * 2)]}} c <i class="material-icons" style="color: var(&#45;&#45;wrong); font-size: 15px">favorite</i></a>-->
<!--      <div class="ver">v1.0.4b</div>-->
<!--    </div>-->
  </div>
</template>

<script>
import {mapActions} from "vuex";
import {mapGetters} from "vuex";

export default {
  name: 'Home',
  data() {
    return{
      theme: 1,
      themePic: "dark_mode",
      email: "",
      password: ""
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
    }
  },
  methods: {
    ...mapActions(["loginVK"]),
    changeTheme() {
      if (this.theme % 2 === 0){
        document.documentElement.setAttribute("theme", "dark")
        this.themePic = "dark_mode"
      } else if (this.theme % 2 === 1) {
        document.documentElement.setAttribute("theme", "light")
        this.themePic = "light_mode"
      }
      // else if (this.theme % 3 === 2){
      //   document.documentElement.setAttribute("theme", "glass")
      //   this.themePic = "science"
      // }
      this.theme += 1
    },
    checkAccount() {
      console.log(this.email)
    },
    start() {
      if (this.CDUser.uid) {
        this.$router.push("/home")
      } else {
        this.$bvModal.show("login_modal")
      }
    }
  }
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

.start, .about{
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
    background: var(--background-light);
  }
}

.start:hover, .about:hover{
  opacity: 0.7;
}

.story{
  background-color: var(--border);
}

.waves{
  width: 100vw;
  margin-top: 15vh;
  position: relative;
  left: 0;
}

.story-chapter{
  padding: 15px 0;
  .text{
    .story-header{
      font-size: 1.2em;
      font-weight: 500;
    }
  }
  .image{
    img{
      width: 100%;
    }
  }
}

.madeby, .ver{
  color: var(--text-color);
}

.ver{
  opacity: 0.7;
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
</style>
