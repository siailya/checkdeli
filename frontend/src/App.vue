<script src="store/modules/products.js"></script>
<template>
  <div id="app">
    <transition name="slide-right">
      <div id="cookies_accept" class="cd-card adaptive-width" v-if="cookies !== 'true'">
      <div class="header text-center color-text">
        Мы используем куки!
      </div>
      <div class="text-center cookies-text mt-3">
        Без кук все работало бы через жопу, а мы не смогли бы получать статистику.
      </div>
      <div class="text-center mt-2">
        <button class="show-full" v-b-modal.full_policy_text>То же самое, но с терминами</button>
      </div>
      <div class="accept text-center mt-3">
        <button class="accept-btn color-text active-btn" @click="acceptCookies">
          Принять и продолжить
        </button>
      </div>
    </div>
    </transition>

    <b-modal id="full_policy_text" hide-header hide-footer content-class="cd-card" centered>
      <div class="full-policy-text">
        <div class="close" @click="$bvModal.hide('full_policy_text')">
          <i class="material-icons">close</i>
        </div>
        Сайт «Чекдели», расположенный в сети Интернет по адресу checkdeli.online использует сервис веб-аналитики Яндекс.Метрика, предоставляемый компанией ООО «ЯНДЕКС», 119021, Россия, Москва, ул. Л. Толстого, 16 (далее — Яндекс).
        <br>
        <br>
        Сервис Яндекс.Метрика использует технологию «cookie» — небольшие текстовые файлы, размещаемые на компьютере пользователей с целью анализа их пользовательской активности.
        <br>
        <br>
        Собранная при помощи cookie информация не может идентифицировать вас, однако может помочь нам улучшить работу нашего сайта. Информация об использовании вами данного сайта, собранная при помощи cookie, будет передаваться Яндексу и храниться на сервере Яндекса в ЕС и Российской Федерации. Яндекс будет обрабатывать эту информацию для оценки использования вами сайта, составления для нас отчетов о деятельности нашего сайта, и предоставления других услуг. Яндекс обрабатывает эту информацию в порядке, установленном в условиях использования сервиса Яндекс.Метрика.
        <br>
        <br>
        Вы можете отказаться от использования cookies, выбрав соответствующие настройки в браузере. Также вы можете использовать инструмент — https://yandex.ru/support/metrika/general/opt-out.html. Однако это может повлиять на работу некоторых функций сайта. Используя этот сайт, вы соглашаетесь на обработку данных о вас Яндексом в порядке и целях, указанных выше.
        <br>
        <br>
        Так же сайт использует технологию «LocalStorage», позволяющую хранить пользовательские данные на устройстве между сессиями. Для продолжения работы вы так же соглашаетесь с тем фактом, что некоторые введенные вами данные будут храниться между сессиями.
      </div>
    </b-modal>
    <transition name="fade" mode="out-in" appear>
      <router-view/>
    </transition>
  </div>
</template>

<script>
import {mapActions} from "vuex";
import VK from "vk-openapi";

export default {
  name: "App",
  data () {
    return {
      transitionName: "fade",
      cookies: window.localStorage.getItem("cookies")
    }
  },
  methods: {
    ...mapActions(["restoreVK"]),
    acceptCookies() {
      window.localStorage.setItem("cookies", "true")
      this.cookies = "true"
    }
  },
  watch: {
    $route(to, from) {
      const toDepth = to.path.split('/').length
      const fromDepth = from.path.split('/').length
      this.transitionName = toDepth < fromDepth ? 'slide-right' : toDepth === fromDepth ? 'fade' : 'slide-right'
    }
  },
  created() {
    VK.init({
      apiId: 7803894
    })


    VK.Auth.getLoginStatus((e) => {
      if (e.status === "connected") {
        this.restoreVK(e)
      }
    }, true)
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap');
@import "../public/colors";

body, html{
  font-family: 'Roboto', sans-serif;
}

body{
  background-color: rgba(255, 255, 255, 0)!important;
  user-select: none;
  overflow-x: hidden;
}

html[theme="glass"]{
  --main: #91B0F2;
  --text-color: #ffffff;
  --text-secondary: #6b6b6b;
  --wrong: #f29194;
  --btn-background: white;
  --border: rgba(255, 255, 255, 0.18);
}

html[theme="light"]{
  --background: #fff;
  --main: #fd9b5c;
  --text-color: #929292;
  --text-secondary: #b3b3b3;
  --border: #e2e2e2;
  --wrong: #ff565c;
  --btn-background: white;
}

html[theme="dark"]{
  --main: #ffdb58;
  --text-color: #f1f1f1;
  --text-secondary: #d0d0d0;
  --border: #4f4f4f;
  --border-light: #8f8f8f;
  --border-somelight: #7c7c7c;
  --wrong: #fd7287;
  --btn-background: #5f5f5f;
  --background: #414141;
  --background-light: #5f5f5f;
  --background-lighter: #888888;
  background-color: #2b2b2b!important;
}

html[theme="glass"]{
  background-image: url("./assets/backq.jpg");
  background-color: var(--main)!important;
  background-repeat: no-repeat;
  background-attachment: fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
}

html[theme="light"]{
  .color-text{
    text-shadow: 0 0 10px rgba(255, 146, 77, 0.5);
  }
}

.color-text{
  color: var(--main)!important;
  transition: all .3s;
}

div, a, button, span{
  transition: all .3s;
}

html[theme="glass"] .cd-card{
  background: rgba( 230, 230, 230, 0.6 )!important;
  box-shadow: 0 8px 32px 0 rgba( 31, 38, 135, 0.37 )!important;
  border-radius: 15px;
  backdrop-filter: blur( 4.5px );
  -webkit-backdrop-filter: blur( 4.5px );
  border: 1px solid rgba( 255, 255, 255, 0.18 );
  padding: 10px;
  //margin: 0 5px;
}

html[theme="light"]{
  .cd-card {
    background: white;
    box-shadow: 0 2px 10px 2px rgba(50, 50, 50, 0.15);
    border-radius: 15px;
    padding: 10px;
    backdrop-filter: blur( 4.5px );
  }

  .shadowed{
    box-shadow: 0 2px 8px 2px rgba(50, 50, 50, 0.1);
  }

  .bordered{
    border: solid 1px var(--border);
  }

  .form-control{
    border: 1px solid var(--border)!important;
  }

  .form-control:focus, .form-control.focus{
    box-shadow: 0 0 0 0.2rem rgb(235, 150, 60, 0.25) !important;
  }
}

html[theme="dark"]{
  div{
    color: var(--text-color);
  }

  .cd-card {
    background: var(--background);
    //box-shadow: 0 0px 5px 1px rgba(255, 255, 255, 0.25);
    border: solid 1px var(--border);
    border-radius: 15px;
    padding: 10px;
    backdrop-filter: blur( 4.5px );
  }

  .shadowed{
    border: solid 1px var(--border-somelight);
  }

  .bordered{
    border: solid 1px var(--border);
  }

  .form-control{
    border: 1px solid var(--border)!important;
    background-color: var(--btn-background)!important;
    color: var(--text-color);
  }

  .form-control:focus, .form-control.focus{
    box-shadow: 0 0 0 0.2rem rgba(235, 185, 60, 0.15) !important;
  }
}

.form-control:focus, .form-control.focus{
  border-color: var(--main)!important;
  box-shadow: 0 0 0 0.2rem rgb(0 0 235 / 25%)!important;
}

.form-control::placeholder{
  color: #dbdbdb!important;
}
.next-wrapper{
  border-radius: 15px;
  padding: 15px 20px;
}

.next-btn{
  border-radius: 20px;
  border: none;
  outline: none;
  background: var(--btn-background);
  padding: 6px 12px;
  font-size: 18px;
  font-weight: 500;
  display: flex;
  width: 100%;
  justify-content: center;
  transition: all .3s;
  color: var(--main);
}

.active-btn:active{
  transition: all .2s;
  transform: scale(0.98);
}

html[theme="glass"] .active-btn:active{
  box-shadow: 0 8px 32px 0 rgba( 31, 38, 165, 0.3 );
}

html[theme="light"] .active-btn:active{
  box-shadow: 0 0 15px 5px rgba(255, 146, 77, 0.3) ;
}

html[theme="dark"] .active-btn:active{
  box-shadow: 0 0 15px 5px rgba(255, 255, 255, 0.5) ;
}


.next-btn-wrong:active{
  transition: all .2s;
  transform: scale(0.98);
  animation: wrong .5s infinite;
  background-color: var(--wrong)!important;
  box-shadow: 0 0 15px 5px rgba(255, 0, 30, 0.3)!important;
}

.next-btn-wrong{
  color: white!important;
}

@keyframes wrong {
  0%, 100% {
  }

  5%, 15%, 25%, 35%, 45%, 55%, 65%, 75%, 85%, 95% {
    transform: translate(-5px, 0);
  }

  10%, 20%, 30%, 40%, 50%, 60%, 70%, 80%, 90% {
    transform: translate(5px, 0);
  }
}

.active-btn{
  transition: all .3s;
}

.vs__dropdown-toggle{
  padding: 2px 0 6px 0!important;
  border-color: #ced4da!important;
  background: white!important;
}

.vs__clear{
  margin-top: -4px;
}


@media screen and (min-width: 768px){
  .page, .adaptive-width{
    width: 80%;
    margin-left: 10%;
  }
}

@media screen and (min-width: 1000px){
  .page, .adaptive-width{
    width: 70%;
    margin-left: 15%;
  }
}

@media screen and (min-width: 1200px){
  .page, .adaptive-width{
    width: 60%;
    margin-left: 20%;
  }
}

@media screen and (min-width: 1400px){
  .page, .adaptive-width{
    width: 50%;
    margin-left: 25%;
  }
}

@media screen and (min-width: 1600px){
  .page, .adaptive-width{
    width: 40%;
    margin-left: 30%;
  }
}

html[theme="glass"] .cd-card.modal-content {
  background: rgba(230, 230, 230, 0.6) !important;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37) !important;
  backdrop-filter: blur(4.5px) !important;
  -webkit-backdrop-filter: blur(4.5px) !important;
  border-radius: 15px !important;
  border: 1px solid rgba(255, 255, 255, 0.18) !important;
  padding: 5px
}

html[theme="light"] .cd-card.modal-content {
  background: white !important;
  border-radius: 15px !important;
  border: 1px solid rgba(255, 255, 255, 0.18) !important;
  padding: 5px;
  color: var(--text-color);
}

.modal-body {
  padding: 10px !important;
}

.intro-slide {
  transition: all .2s;
  z-index: 1000;
}

.slide-right-enter{
  opacity: 0;
  transform: translateX(500px);
}
.slide-right-leave-to {
  opacity: 0;
  transform: translateX(-500px);
}
.slide-right-leave-active {
  position: absolute;
}

.sortable-drag {
  opacity: 0!important;
}

.cd-radio {
  border-radius: 50px;
  border: var(--border) solid 2px;
  height: 18px;
  min-width: 18px;
  padding: 2px;

  .cd-radio-in {
    width: 100%;
    height: 100%;
    background: var(--main);
    border-radius: 50px;
    transition: all .3s;
  }
}

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

<style scoped lang="scss">
#cookies_accept{
  position: fixed;
  bottom: 10px;
  z-index: 1031;
  width: 90%;
  left: 5%;
  margin-left: 0;
}

.header{
  font-size: 1.2em;
  font-weight: 500;
}

.cookies-text{
  color: var(--text-color);
}

.show-full{
  color: var(--main);
  text-decoration: underline;
  border: none;
  background: none;
}

html[theme="glass"]{
  .accept-pls, .show-full, .header{
    color: white;
  }
}

.accept-btn{
  border: none;
  outline: none;
  border-radius: 30px;
  padding: 8px 12px;
  background: var(--btn-background);
  font-size: 18px;
}

.full-policy-text{
  color: var(--text-color);
  i{
    color: var(--text-color);
  }
}

</style>