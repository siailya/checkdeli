<template>
  <div class="cd-avatar" key="unchecked">
    <img :src="src || user.avatar" alt="" v-if="user.avatar">
    <img :src="src || 'https://icotar.com/initials/' + (user.name || '~') + '?fg=' + mainColor + '&bg=ffffff'" alt="" v-else>
    <transition name="bounce" appear>
      <img class="checked" :src="'https://icotar.com/initials/✓?fg=ffffff&bg=' + mainColor" alt="" v-if="checked">
    </transition>
  </div>
</template>

<script>
export default {
  name: "CdAvatar",
  props: {
    user: {
      default: () => {return {}},
    },
    checked: {},
    allUsers: {},
    src: {}
  },
  computed: {
    mainColor() {
      return window.getComputedStyle(document.documentElement).getPropertyValue('--main').replace("#", "").replace(" ", "")
    }
  }
}
</script>

<style scoped lang="scss">
.cd-avatar{
  border: 1px solid rgba(255, 255, 255, 0.18);
  min-width: 50px;
  max-width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 8px;
  img{
    height: 100%;
  }
}

html[theme="light"] {
  .cd-avatar {
    border: 1px solid var(--border);
  }
}

html[theme="dark"] {
  .cd-avatar {
    border: 1px solid var(--border-light);
  }
}

.checked{
  position: relative;
  left: -100%;
  opacity: 0.75;
  border-radius: 50%;
}
</style>