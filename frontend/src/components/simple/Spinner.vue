<script setup lang="ts">
interface Props {
  center?: boolean
}

withDefaults(defineProps<Props>(), {
  center: false
})
</script>

<template>
  <div class="lds-ring spinner" :class="{ 'spinner-center': center }">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
</template>

<style scoped lang="scss">
/* @import "../../style/setup/_variables.scss"; */

.lds-ring {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;

  &.spinner-center {
    display: block;
    margin: 0 auto;
  }
}
.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 64px;
  height: 64px;
  margin: 8px;
  border: 8px solid rgb(var(--color-blue));
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: rgb(var(--color-blue)) transparent transparent transparent;
}
.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
