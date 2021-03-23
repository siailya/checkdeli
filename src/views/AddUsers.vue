<template>
  <div class="add-users">
    <div class="cd-card users-container mt-3">
      <div class="button-wrapper d-flex justify-content-center">
        <button class="active-btn add-user-btn shadowed" @click="() => {addUser(); animateList()}">
          <span class="color-text d-flex align-items-center"><i class="material-icons mr-2">add_circle_outline</i> Добавить человека</span>
        </button>
      </div>
    </div>
    <div class="cd-card users-wrapper" ref="users_wrapper" style="height: 160px">
      <transition name="fade">
        <div v-if="users.length <= 0" class="empty-users text-center">
              <span class="">
                <i class="material-icons color-text">sync</i>
                <br>
                Пока что пусто...
                <br>
                Добавим кого-нибудь!
              </span>
        </div>
      </transition>
      <draggable class="list-group"
                 :list="users_list"
                 group="people"
                 ref="user_list"
                 tag="div"
                 v-model="users_list"
                 v-bind="dragOptions"
                 @start="drag = true"
                 @end="drag = false"
                 handle=".handle"
      >
        <transition-group type="transition" :name="!drag ? 'flip-list' : null" tag="div">
          <div
              :style="!drag ? 'transition: all .3s;' : null"
              class="user-cell d-flex justify-content-between"
              v-for="(user, index) in users_list"
              :key="user.id"
              :id="'user_cell_' + index"
          >
            <div class="d-flex w-100 main-content" :id="'main_content_' + index">
              <div class="avatar">
                <img :src="'https://icotar.com/initials/' + (user.name || '~') + '?fg=' + mainColor + '&bg=ffffff'" alt="">
              </div>
              <input class="form-control" v-model="user.name"/>
              <i class="material-icons ml-2 mt-auto mb-auto handle">drag_handle</i>
            </div>
          </div>
        </transition-group>
      </draggable>
    </div>
    <transition name="fade">
      <div class="delete-area" v-if="drag">
        <div class="delete-description d-flex justify-content-center">
          <span class="text-center"><i class="material-icons">delete_outline</i> <br> Удаляй, удаляй, мы же миллионеры, нового добавим</span>
        </div>
        <draggable class="list-group" :list="list_delete" group="people" @change="deleteUserComplete">
        </draggable>
      </div>
    </transition>
    <div class="cd-card next-wrapper mt-3 mb-3">
      <button class="active-btn next-btn shadowed" id="next-btn" @click="validateNext">
        <span class="d-flex color-text justify-content-center align-items-center">
        Дальше!
        </span>
      </button>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import {mapActions, mapGetters} from "vuex";

export default {
  name: "AddUsers",
  data() {
    return {
      drag: false,
      currentOpen: null,
      list_delete: []
    }
  },
  components: {
    draggable,
  },
  computed: {
    ...mapGetters(["users"]),
    users_list: {
      get() {
        return this.users
      },
      set(value) {
        this.$store.commit('updateUsers', value)
      }
    },
    mainColor() {
      return window.getComputedStyle(document.documentElement).getPropertyValue('--main').substr(2)
    },
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      };
    }
  },
  methods: {
    ...mapActions(["addUser", "deleteUser", "setDefaultPayed"]),
    animateList() {
      if (this.users.length > 1) {
        let new_height = this.users.length * 74 + 10
        let el = document.getElementsByClassName("users-wrapper")[0]
        el.style.height = new_height + "px"
      } else {
        let el = document.getElementsByClassName("users-wrapper")[0]
        el.style.height = 90 + "px"
      }

    },
    deleteUserComplete(index) {
      console.log(index)
      if (this.users.length > 0) {
        let new_height = this.users.length * 74 + 10
        let el = document.getElementsByClassName("users-wrapper")[0]
        el.style.height = new_height + "px"
      } else {
        let el = document.getElementsByClassName("users-wrapper")[0]
        el.style.height = "150" + "px"
      }
    },
    validateNext() {
      function showWrong (text) {
        let el = document.getElementById("next-btn")
        el.style.animation = "wrong .3s infinity"
        el.classList.add("next-btn-wrong")
        el.style.backgroundColor = "var(--wrong)"
        el.children[0].classList.remove("color-text")
        el.children[0].innerHTML = text
        el.children[0].style.fontWeight = "400"
        // el.children[0].style.fontSize = "16px"
        setTimeout(() => {
          // el.children[0].style.fontSize = "18px"
          el.classList.remove("next-btn-wrong")
          el.style.animation = ""
          el.style.backgroundColor = "white"
          el.children[0].classList.add("color-text")
          el.children[0].style.fontWeight = "500"
          el.children[0].innerHTML = "Дальше!"
        }, 2500)
      }

      if (this.users.length < 2) {
        if (this.users.length === 1) {
          showWrong("Добавим еще кого-нибудь?")
        } else {
          showWrong("Тут никого нет!")
        }
      }
      else if (this.users.filter((el) => {return el.name.trim() === ''}).length !== 0) {
        showWrong("Стоит всем дать имена!")
      } else {
        this.$router.push("/calculating")
        console.log(this.users[0].id)
        this.setDefaultPayed(this.users[0].id)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.add-users{
  padding: 0 16px;
}

html[theme="glass"] .users-container{
  box-shadow: 0 0 0 0 rgba( 31, 38, 135, 0.1 )!important;
}

.users-container{
  border-radius: 15px 15px 0 0!important;
  overflow: hidden;
  padding: 0!important;
  border-bottom: none;
}

.button-wrapper{
  background: rgba(255, 255, 255, 0.5);
  padding: 15px 0!important;
  button{
    span{
      font-weight: 500;
    }
  }
}

html[theme="dark"]{
  .button-wrapper {
    background: var(--background-light);
  }
}

.add-user-btn{
  border: none;
  outline: none;
  border-radius: 30px;
  padding: 8px 12px;
  background: var(--btn-background);
  font-size: 18px;
}

.empty-users{
  position: absolute;
  width: 90%;
  left: 5%;
  color: var(--text-color);
  margin-top: 10px;
  margin-bottom: 10px;
  span{
    i{
      font-size: 72px;
      color: var(--main);
    }
    font-weight: 400;
    font-size: 18px;
  }
}

.users-wrapper{
  transition: all 0.5s;
  padding: 6px 6px 12px 6px!important;
  margin-bottom: 6px!important;
  min-height: 20px;
  border-radius: 0 0 15px 15px!important;
  overflow: auto;
  border-top: none;
  overflow-x: hidden;
  max-height: 70vh!important;
  box-shadow: 0px 5px 10px 2px rgba(50, 50, 50, 0.15)!important;
}

html[theme="light"] {
  .users-wrapper{
    border-top: 1px solid var(--border);
  }
}

.user-cell{
  //transition: all .3s;
  cursor: move;
  padding: 12px;
  overflow: hidden;
  border-radius: 10px;
  input{
    margin-top: auto;
    margin-bottom: auto;
    outline: none;
  }
}

.main-content{
  transition: all .3s;
}

.avatar{
  border: 1px solid rgba(255, 255, 255, 0.18);
  min-width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 8px;
}

.handle{
  color: white;
}

html[theme="light"] {
  .avatar {
    border: 1px solid var(--border);
  }

  .handle{
    color: var(--main);
  }

  .next-wrapper{
    box-shadow: none;
    padding: 15px 0;
  }
}

html[theme="dark"] {
  .avatar {
    border: 1px solid var(--border-light);
  }
}

.delete-area{
  z-index: 1000;
  background: rgba( 222, 73, 73, 0.75 );
  backdrop-filter: blur( 4.5px );
  -webkit-backdrop-filter: blur( 4.5px );
  border-radius: 10px;
  border: 2.5px dashed rgba( 255, 255, 255, 0.18 );
  padding: 15px;
  margin: 0 5px;
  position: absolute;
  bottom: 5vh;
  height: 100px;
  width: 90%;
  left: 5%;
  box-shadow: 0 -200px 0 900px rgb(0 0 0 / 50%);
  @media screen and (min-width: 768px){
    width: 60%;
    margin-left: 20%;
  }
}

.delete-description{
  position: absolute;
  z-index: 1000;
  width: 80%;
  left: 10%;
  opacity: 0.7;
  color: white;
  font-size: 0.6em;
  i{
    font-size: 48px;
  }
}

.next-btn.shadowed{
  box-shadow: 0 5px 10px 2px rgba(50, 50, 50, 0.15);
}
</style>

<style>
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0.5s;
}
.ghost {
  opacity: 0.2!important;
  background: var(--main);
}
.list-group {
  min-height: 20px;
}
.list-group-item i {
  cursor: pointer;
}
.flip-list-item {
  transition: all 5s;
  display: inline-block;
  margin-right: 10px;
}
.flip-list-enter, .flip-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
.flip-list-leave-active {
  position: absolute;
}
</style>