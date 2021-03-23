<template>
  <div class="home">
    <b-modal id="about_modal" content-class="cd-card" centered hide-header hide-footer>
      <div class="about-header text-center">Какой сейчас год?</div>
      <div class="about-subheader text-center">
        2021. А ты все еще делишь чеки на листочке...
      </div>
      <div class="about-content text-center">
        Всем, кого заставляют делить чеки после [веселой] тусовки посвящается.
        <div class="what-ready text-left">
          Что сделано: <br>
          - Добавление/удаление пользователей <br>
          - Добавление/удаление позиций <br>
          - Выбор пользователей в каждой позиции <br>
          - Выбор плательщика в каждой позиции <br>
          - Расчёт с оптимизацией <br>
          - Темы (светлая и стеклянная)!!!<br>
        </div>
        Но лучше попробовать!
      </div>
    </b-modal>
    <div class="theme-change cd-card">
      <button class="change-theme d-flex" @click="changeTheme">
        <i class="material-icons mt-auto mb-auto">{{themePic}}</i>
      </button>
    </div>
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
        <router-link to="/addusers">
          <button class="start active-btn">
            <span class="color-text">Разделить чек</span>
          </button>
        </router-link>
      </div>
      <div class="cd-card ml-1">
        <button v-b-modal.about_modal class="about active-btn">
          <span class="color-text">?</span>
        </button>
      </div>
    </div>
    <div class="fixed-bottom">
      <a href="https://vk.com/overcreated" class="madeby align-items-center">Сделано {{["overcreated", "siailya"][Math.floor(Math.random() * 2)]}} c <i class="material-icons" style="color: var(--wrong); font-size: 15px">favorite</i></a>
      <div class="ver">v1.0.2b</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return{
      theme: 1,
      themePic: "dark_mode"
    }
  },
  computed: {
    themeIcon() {
      if (document.documentElement.getAttribute("theme") === "glass") {
        return "light_mode"
      } else {
        return "science"
      }
    }
  },
  methods: {
    changeTheme() {
      if (this.theme % 3 === 0){
        document.documentElement.setAttribute("theme", "dark")
        this.themePic = "dark_mode"
      } else if (this.theme % 3 === 1) {
        document.documentElement.setAttribute("theme", "light")
        this.themePic = "light_mode"
      } else if (this.theme % 3 === 2){
        document.documentElement.setAttribute("theme", "glass")
        this.themePic = "science"
      }
      this.theme += 1
    }
  }
}
</script>

<style scoped lang="scss">
.theme-change{
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

.intro{
  display: flex;
  justify-content: center;
  @media screen and (min-width: 530px){
    width: 80%;
    margin-left: 10%;
  }
  @media screen and (min-width: 1000px){
    width: 60%;
    margin-left: 20%;
  }
  .first, .second, .third{
    width: calc(100%/3 - 12px);
    margin: 6px;
    .step{
      height: 90px;
      font-size: 72px;
      text-align: start;
      color: #F17300;
      opacity: 0.1;
      font-weight: bold;
      position: relative;
      margin-left: 10px;
    }
    .icon{
      margin-top: -60px;
    }
    .description{
      color: #a9a9a9;
      font-weight: 300;
      font-size: 12px;
    }
  }
}

.madeby, .ver{
  color: var(--text-color);
}

.ver{
  opacity: 0.7;
}

.about-header{
  font-size: 20px;
  font-weight: 500;
  color: var(--text-color);
}

.about-subheader{
  font-weight: 500;
}

.about-subheader, .about-content{
  color: var(--text-color);
}
</style>
