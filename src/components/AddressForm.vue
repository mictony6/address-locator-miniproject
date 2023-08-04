<template>
  <div class="container p-4">
    <div class="box">
      <div class="content">
        <h3 class="title is-4">Input</h3>
      </div>

      <form
        @reset.prevent="handleReset"
        @submit.prevent="handleSubmit"
        class="px-4"
      >
        <div class="field">
          <label for="provinceInput" class="label">Province</label>
          <div class="control has-icons-left">
            <span class="icon is-left is-small">
              <img :src="pinIcon" alt="" />
            </span>
            <div class="select">
              <select
                :disabled="localState.provinceDisabled"
                @change="
                  (e) => {
                    updateState('setProvince', e.target.value);
                    this.localState.municipalityDisabled = false;
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
          <label for="municipalityInput" class="label">Municipality</label>
          <div class="control has-icons-left">
            <span class="icon is-left is-small">
              <img :src="pinIcon" alt="" />
            </span>
            <div class="select">
              <select
                :disabled="localState.municipalityDisabled"
                :value="municipality"
                @change="
                  (e) => {
                    updateState('setMunicipality', e.target.value);
                    getBarangays();
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
        <div class="field">
          <label for="barangayInput" class="label">Barangay</label>
          <div class="control has-icons-left">
            <span class="icon is-left is-small">
              <img :src="pinIcon" alt="" />
            </span>
            <div class="select">
              <select
                :disabled="localState.barangayDisabled"
                :value="barangay"
                @change="
                  (e) => {
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
          <div class="control">
            <label for="addressInput" class="label">Address</label>
            <input
              :disabled="localState.addressDisabled"
              @input="
                (e) => {
                  updateState('setSearchText', e.target.value);
                  getSuggestions();
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
        <div class="field is-grouped">
          <div class="control">
            <button type="submit" class="button is-link">Submit</button>
          </div>
          <div class="control">
            <button type="reset" class="button is-link is-light">Reset</button>
          </div>
        </div>
      </form>
      <figure class="image p-4">
        <iframe
          v-if="searchText.length"
          width="600"
          height="450"
          style="border: 0"
          loading="lazy"
          allowfullscreen
          referrerpolicy="no-referrer-when-downgrade"
          :src="placeUrl"
        >
        </iframe>
      </figure>
    </div>
  </div>
</template>
<script>
import pinIcon from "@/assets/map-pin.svg";
import axios from "axios";
import { mapGetters, mapState } from "vuex";

export default {
  name: "AddressForm",
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
      })
      .catch((e) => console.error(e));
  },
  data() {
    return {
      localState: {
        provinceDisabled: false,
        municipalityDisabled: true,
        barangayDisabled: true,
        addressDisabled: true,
      },
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
    ]),
    ...mapGetters(["provinces", "municipalities", "placeUrl"]),
  },
  methods: {
    getBarangays() {
      let url = `https://demo.myruntime.com/website/fulfillmentClustersService/api/getPhilClusterOptions/myruntimeWeb?parentOption=${this.province}&childOption=${this.municipality}`;

      axios
        .get(url)
        .then((res) => {
          this.updateState("setBarangays", res.data.data);
        })
        .catch((e) => console.error(e));
      this.localState.barangayDisabled = false;
      this.localState.addressDisabled = false;
    },
    getSuggestions() {
      let url = `http://localhost:3000/autocomplete?province=${this.province}&municipality=${this.municipality}&barangay=${this.barangay}&searchText=${this.searchText}`;
      axios
        .get(url)
        .then((res) => {
          this.updateState("setSuggestions", res.data);
        })
        .catch((e) => console.error(e));
    },
    handleSubmit() {
      console.log("submitted");
    },
    handleReset() {
      this.localState.municipalityDisabled =
        this.localState.barangayDisabled =
        this.localState.addressDisabled =
          true;
      this.$store.dispatch("resetInput");
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
