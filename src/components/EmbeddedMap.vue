<template>
  <figure class="image p-4">
    <iframe
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
export default {
  name: "EmbeddedMap",
  props: {
    localPlaceUrl: {},
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
