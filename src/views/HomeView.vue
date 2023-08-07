<template>
  <main>
    <TheBanner />
    <AddressForm />
  </main>
</template>

<script>
import AddressForm from "@/components/AddressForm.vue";
import TheBanner from "@/components/TheBanner.vue";
export default {
  components: {
    TheBanner,
    AddressForm,
  },
};
</script>
