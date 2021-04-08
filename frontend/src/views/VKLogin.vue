<template>
  <div class="vklogin">
    <div class="cd-card text-center vk-login-card">
      <div class="login-header mb-2">
        Логинимся через ВК
      </div>
      Общаемся с Маском и осуждаем возможность логина через ВК <br>
      Ничего не делайте, нужно просто подождать :)
      <div class="login-spinner mt-4 mb-3">
        <b-spinner type="grow" class="color-text">
        </b-spinner>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {BACKEND} from "../../backend.config";

export default {
  name: "VKLogin",
  mounted() {
    axios.post(BACKEND + "/login/vk",
        {secret: this.$route.query.code}
        )
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
}
</style>