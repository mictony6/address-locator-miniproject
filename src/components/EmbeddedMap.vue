<template>
  <figure class="image p-4">
    <iframe
      v-show="isMapShow"
      class="map-frame"
      loading="lazy"
      allowfullscreen
      referrerpolicy="no-referrer-when-downgrade"
      :src="localPlaceUrl"
    >
    </iframe>
  </figure>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  name: "EmbeddedMap",
  props: {
    localPlaceUrl: {},
  },
  computed: {
    ...mapGetters(["isMapShow"]),
  },
};
</script>

<style>
.map-frame {
  width: 100%;
  height: 450px;
  border-radius: 12px;
}
</style>
