<template>
  <div class="steps d-flex justify-content-around">
    <div class="step d-flex" v-for="(step, index) in steps" :key="index">
      <div class="step-wrapper text-center">
        <div class="shadowed step-icon m-auto" :class="!(index > current) ? 'active-step' : ''">
          <transition name="fade">
            <i class="material-icons-outlined">{{(index >= current) ? step.icon : 'done'}}</i>
          </transition>
        </div>
        <div class="mt-1">
          {{step.title}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CdStepper",
  props: ["steps", "current"]
}
</script>

<style scoped lang="scss">
.step-wrapper{
  font-size: 0.7em;
}

.step-icon{
  border-radius: 50px;
  width: 35px;
  height: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all .3s;
  i{
    transition: all .3s;
    color: var(--main);
    font-size: 20px;
  }
}

.active-step{
  background-color: var(--main);
  i{
    color: white;
  }
}
</style>