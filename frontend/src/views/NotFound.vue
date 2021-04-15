<template>
  <div class="not-found page text-center">
    <div class="e404 color-text">
      404
    </div>
    <div class="err">
      Нот фаунд.
    </div>
    <div class="err-add">
      А куда ты хочешь попасть?
    </div>
    <div class="links d-flex justify-content-center mt-4">
      <router-link to="/" class="mr-1 w-100">
        Хочу домой
      </router-link>
      <a class="ml-1 w-100" href="https://vk.com/overcreated" target="_blank">
        Не хочу домой
      </a>
    </div>
  </div>
</template>

<script>

export default {
  name: "NotFound"
}
</script>

<style scoped lang="scss">
.not-found{
  padding: 16px;
}

.e404{
  margin-top: 20vh;
  font-size: 5em;
  font-weight: 600;
  animation: blinks 4s infinite;
}

.err{
  font-size: 1.2em;
  font-weight: 500;
}

@keyframes blinks {
  0%, 6%, 15%, 18%, 20%, 27%, 37%, 43%, 63% {
    opacity: 1;
  }
  4%, 12%, 17%, 19%, 25%, 35%, 40%, 60% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.links{
  a{
    color: var(--text-color);
    text-decoration: none;
    border-radius: 50px;
    border: var(--border) 1px solid;
    padding: 4px 8px;
    background-color: var(--btn-background);
  }
}
</style>