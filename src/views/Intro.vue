<template>
  <div class="intro">
    <div class="intro-slider mt-4">
      <transition name="slide-right" appear>
        <div key="12312" class="intro-slide text-center" v-if="activeSlide === 0">
          <div class="slide-header color-text">
            {{slides[activeSlide][0]}}
          </div>
          <div class="slide-subheader">
            {{slides[activeSlide][1]}}
          </div>
          <div class="slide-pic mt-2 mb-2">
            <div class="img-wrapper">
              <img :src="slides[activeSlide][2]" alt="">
            </div>
          </div>
          <div class="slide-text">
            {{slides[activeSlide][3]}}
          </div>
        </div>
        <div key="2344432" class="intro-slide text-center" v-if="activeSlide === 1">
          <div class="slide-header color-text">
            {{slides[activeSlide][0]}}
          </div>
          <div class="slide-subheader">
            {{slides[activeSlide][1]}}
          </div>
          <div class="slide-pic mt-2 mb-2">
            <div class="img-wrapper">
              <img :src="slides[activeSlide][2]" class="img-fluid" alt="">
            </div>
          </div>
          <div class="slide-text">
            {{slides[activeSlide][3]}}
          </div>
        </div>
        <div key="435434" class="intro-slide text-center" v-if="activeSlide === 2">
          <div class="slide-header color-text">
            {{slides[activeSlide][0]}}
          </div>
          <div class="slide-subheader">
            {{slides[activeSlide][1]}}
          </div>
          <div class="slide-pic mt-2 mb-2">
            <div class="img-wrapper">
              <img :src="slides[activeSlide][2]" class="img-fluid" alt="">
            </div>
          </div>
          <div class="slide-text">
            {{slides[activeSlide][3]}}
          </div>
        </div>
      </transition>
      <div class="next-slide mt-4">
        <button class="w-100 active-btn shadowed" @click="activeSlide !== 2 ? activeSlide += 1 : onboardingEnd()">
          {{buttonCaptions[activeSlide]}}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import meme from "../assets/meme1.png"

export default {
  name: "Intro",
  data() {
    return{
      slides: [
          ["Эй, проснись!",
            "Ну ты и соня. Тебя даже вчерашний шторм не разбудил. Говорят, уже можно не делить чеки в экселе и на бумажке!",
            meme,
            "Теперь можно просто, тыкая в экран, перечислить все то, что было выпито и съедено вчера вечером!"
          ],
          ["Мне чек, и моему другу тоже",
            "А еще часто бывает так, что образовалось несколько чеков, и в итоге полная путаница с тем, кто кому должен",
            "http://risovach.ru/upload/2020/07/mem/zloy-baldi_244893642_orig_.png",
            "Сейчас ты точно уверен в своих 60+ на ЕГЭ по математике? Если да, то не стоит тратить время..."
          ],
          ["Ладно. Что ладно-то?",
            "Если нет, то давай научу пользоваться калькулятором! Но не простым, естественно",
            "http://risovach.ru/upload/2019/03/mem/printer-chekov_203357724_orig_.jpg",
            "Тут можно поделить сколько угодно и на сколько угодно! Добро пожаловать!"
          ],
      ],
      slideHeader: "Эй, проснись!",
      buttonCaptions: ["Ок. И чё?", "Ладно", "Поехали!"],
      activeSlide: 0
    }
  },
  methods: {
    onboardingEnd() {
      this.$router.push("/")
      window.localStorage.setItem("onboarding", "true")
    }
  }
}
</script>

<style scoped lang="scss">
.intro{
  padding: 10px 16px;
}

.intro-slide{
  padding-bottom: 10vh;
}

.slide-header{
  color: var(--main);
  font-size: 28px;
  line-height: 1;
  font-weight: 500;
  margin-bottom: 2vh;
}

.slide-subheader{
  color: var(--text-color)
}

.slide-pic{
  //max-height: 50vh;
  height: 50vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .img-wrapper{
    display: flex;
    height: 100%;
  }
  img{
    border-radius: 5%;
    width: 100%;
    height: 100%;
    //min-height: 100%;
    //max-height: 50vh;
    //max-width: 90vh;
    object-fit: cover;
  }
}

.slide-text{
  color: var(--text-color)
}

.next-slide{
  position: fixed;
  bottom: 2vh;
  margin-left: 0;
  width: 90%;
  left: 5%;
  button{
    border-radius: 20px;
    border: none;
    outline: none;
    background: var(--btn-background);
    padding: 6px 12px;
    font-size: 18px;
    font-weight: 500;
    display: flex;
    justify-content: center;
    transition: all .3s;
    color: var(--main);
  }
}
</style>