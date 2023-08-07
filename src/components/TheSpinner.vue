<template>
  <figure>
    <img :src="spinner" alt="spinner" class="icon spinner" />
  </figure>
</template>

<script>
import spinner from "@/assets/spinner.svg";
export default {
  name: "TheSpinner",
  setup() {
    return {
      spinner,
    };
  },
};
</script>

<style scoped lang="scss">
.spinner {
  position: absolute;
  margin: auto;
}
</style>
