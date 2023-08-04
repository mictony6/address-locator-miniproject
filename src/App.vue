<template>
  <RouterView />
</template>

<script>
import { RouterView } from "vue-router";
export default {
  components: {
    RouterView,
  },
};
</script>

<style lang="scss">
@import "./assets/main.css";
@import "./sass/mystyles";
</style>
