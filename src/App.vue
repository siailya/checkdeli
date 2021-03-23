<template>
  <div id="app">
    <div class="page">
      <transition name="fade" mode="out-in" appear>
        <router-view/>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  data () {
    return {
      transitionName: "fade"
    }
  },
  watch: {
    $route(to, from) {
      const toDepth = to.path.split('/').length
      const fromDepth = from.path.split('/').length
      console.log(toDepth, fromDepth)
      this.transitionName = toDepth < fromDepth ? 'slide-right' : toDepth === fromDepth ? 'fade' : 'slide-right'
    }
  },
  created() {
    if (window.localStorage.getItem("onboarding") !== "true") {
      this.$router.push("/intro")
    }
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
  color: var(--main);
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

  .form-control:focus{
    box-shadow: 0 0 0 0.2rem rgb(235, 150, 60, 0.25) !important;
  }
}

html[theme="dark"]{
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
  }

  .form-control:focus{
    box-shadow: 0 0 0 0.2rem rgb(235, 150, 60, 0.25) !important;
  }
}

.form-control:focus{
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
  .page,{
    width: 80%;
    margin-left: 10%;
  }
}

@media screen and (min-width: 1000px){
  .page{
    width: 70%;
    margin-left: 15%;
  }
}

@media screen and (min-width: 1200px){
  .page{
    width: 60%;
    margin-left: 20%;
  }
}

@media screen and (min-width: 1400px){
  .page{
    width: 50%;
    margin-left: 25%;
  }
}

@media screen and (min-width: 1600px){
  .page{
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
</style>
