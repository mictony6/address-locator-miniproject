<template>
  <div class="container p-4 my-4">
    <div class="box columns is-centered">
      <form
        @change="handleFormChange"
        @submit.prevent="updateLocalPlaceUrl"
        @reset.prevent="handleReset"
        class="px-4 column"
      >
        <div class="content">
          <h3 class="title is-4">Address:</h3>
        </div>
        <div class="field">
          <label for="provinceInput" class="label">Province:</label>
          <div class="control has-icons-left">
            <span class="icon is-left is-small">
              <img :src="pinIcon" alt="" />
            </span>
            <div class="select">
              <select
                :disabled="isProvinceDisabled"
                @change="
                  (e) => {
                    handleReset();
                    updateState('setProvince', e.target.value);
                  }
                "
                name="province"
                id="provinceInput"
                :value="province"
              >
                <option value="" disabled selected>Select your province</option>
                <option v-for="(province, index) in provinces" :key="index">
                  {{ province }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <div class="field">
          <label for="municipalityInput" class="label">Municipality:</label>
          <div class="control has-icons-left">
            <span class="icon is-left is-small">
              <img :src="pinIcon" alt="" />
            </span>
            <div class="select">
              <select
                :disabled="isMunicipalityDisabled"
                :value="municipality"
                @change="
                  (e) => {
                    updateState('setMunicipality', e.target.value);
                    updateBarangays();
                  }
                "
                name="municipality"
                id="municipalityInput"
              >
                <option value="" disabled selected>
                  Select your municipality
                </option>
                <option
                  v-for="(municipality, index) in municipalities"
                  :key="index"
                >
                  {{ municipality }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <div class="field is-fullwidth">
          <label for="barangayInput" class="label">Barangay:</label>
          <div
            class="control has-icons-left"
            :class="{ 'is-loading': !isBarangaysReady }"
          >
            <span class="icon is-left is-small">
              <img :src="pinIcon" alt="" />
            </span>
            <div class="select">
              <select
                :disabled="isBarangayDisabled"
                :value="barangay"
                @change="
                  (e) => {
                    updateState('setSearchText', '');
                    updateState('setBarangay', e.target.value);
                  }
                "
                name="barangay"
                id="barangayInput"
              >
                <option value="" disabled selected>Select your barangay</option>
                <option v-for="(brgy, index) in barangays" :key="index">
                  {{ brgy }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <div class="field">
          <div class="control" :class="{ 'is-loading': !isSuggestionsReady }">
            <label for="addressInput" class="label">Address:</label>
            <input
              :disabled="isBarangayDisabled"
              @input="
                (e) => {
                  updateState('setSearchText', e.target.value);
                  updateSuggestions();
                }
              "
              :value="searchText"
              class="input"
              type="text"
              id="addressInput"
              list="addresses"
            />
            <datalist id="addresses">
              <option
                v-for="(suggestion, index) in suggestions"
                :value="suggestion.address"
                :key="index"
              >
                {{ suggestion.address }}
              </option>
            </datalist>
          </div>
        </div>
        <div class="buttons field is-grouped">
          <div class="control">
            <button
              type="submit"
              class="button is-link has-background-primary-dark"
              :class="{ 'is-loading': !isSuggestionsReady }"
            >
              Find Location
            </button>
          </div>
          <div class="control">
            <button type="reset" class="button is-link is-warning">
              Reset Fields
            </button>
          </div>
        </div>
      </form>
      <div class="column">
        <EmbeddedMap :local-place-url="localPlaceUrl" />
      </div>
    </div>
  </div>
</template>
<script>
import pinIcon from "@/assets/map-pin.svg";
import axios from "axios";
import { mapGetters, mapState } from "vuex";
import EmbeddedMap from "@/components/EmbeddedMap.vue";

export default {
  name: "AddressForm",
  components: { EmbeddedMap },
  setup() {
    return {
      pinIcon,
    };
  },
  mounted() {
    const optionsUrl =
      "https://demo.myruntime.com/website/fulfillmentClustersService/api/getPhilClusters/myruntimeWeb";
    //fetches options for provinces and municipalities
    axios
      .get(optionsUrl)
      .then((res) => {
        this.updateState("setOptions", res.data.data);
        let params = this.$route.params;

        this.updateState("setProvince", params.province);
        this.updateState("setMunicipality", params.municipality);
        if (params.municipality.length) {
          this.updateBarangays();
          this.updateState("setBarangay", params.barangay);
          this.updateState("setSearchText", params.searchText);
          this.updateLocalPlaceUrl();
        }
      })
      .catch((e) => console.error(e));
  },
  data() {
    return {
      localPlaceUrl:
        "https://www.google.com/maps/embed/v1/place?key=AIzaSyAwn13ThmiYHeKpMG63f24oiVVsGjP_oWc&q=Philippines",
    };
  },
  computed: {
    ...mapState([
      "options",
      "province",
      "municipality",
      "barangays",
      "barangay",
      "searchText",
      "suggestions",
      "isSuggestionsReady",
    ]),
    ...mapGetters([
      "provinces",
      "municipalities",
      "placeUrl",
      "isProvinceDisabled",
      "isMunicipalityDisabled",
      "isMunicipalityDisabled",
      "isBarangayDisabled",
      "isBarangaysReady",
    ]),
  },
  methods: {
    updateBarangays() {
      this.$store.dispatch("updateBarangays");
    },
    updateSuggestions() {
      if (this.searchText.length) {
        this.$store.dispatch("updateSuggestions");
      }
    },
    updateLocalPlaceUrl() {
      this.localPlaceUrl = this.placeUrl;
    },
    handleFormChange() {
      this.$router.push({
        name: "locator",
        params: {
          province: this.province,
          municipality: this.municipality,
          barangay: this.barangay,
          searchText: this.searchText,
        },
      });
    },
    handleReset() {
      this.$store.dispatch("resetInput");
      this.$router.push({ name: "locator" });
    },
    updateState(type, value) {
      this.$store.commit({
        type,
        value,
      });
    },
  },
};
</script>
