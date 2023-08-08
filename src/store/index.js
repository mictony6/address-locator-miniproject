import { createStore } from "vuex";
import axios from "axios";

export default createStore({
  state: {
    options: null,
    province: "",
    municipality: "",
    barangays: [],
    barangay: "",
    searchText: "",
    suggestions: [],
    barangaysCache: {},
    suggestionsCache: {},
    isSuggestionsReady: true,
  },
  getters: {
    provinces(state) {
      return state.options
        ? state.options["parentOptions"]
        : ["No provinces found"];
    },
    // options for municipality
    municipalities(state) {
      return state.province
        ? [...state.options["childOptions"][state.province]].sort()
        : ["No municipalities found"];
    },
    placeUrl(state) {
      return `https://www.google.com/maps/embed/v1/place?key=AIzaSyAwn13ThmiYHeKpMG63f24oiVVsGjP_oWc
    &q=${state.searchText}`;
    },
    isProvinceDisabled(state) {
      return !state.options;
    },
    isMunicipalityDisabled(state) {
      return !state.province.length;
    },
    isBarangayDisabled(state) {
      return !state.municipality.length;
    },
    isBarangaysReady(state) {
      return !!state.barangays;
    },
    isMapShow(state) {
      return state.searchText.length;
    },
  },
  mutations: {
    setOptions(state, payload) {
      state.options = payload.value;
    },
    setProvince(state, payload) {
      state.province = payload.value;
    },
    setMunicipality(state, payload) {
      state.municipality = payload.value;
    },
    setBarangays(state, payload) {
      state.barangays = payload.value;
    },
    setBarangay(state, payload) {
      state.barangay = payload.value;
    },
    setSearchText(state, payload) {
      state.searchText = payload.value;
    },
    setSuggestions(state, payload) {
      state.suggestions = payload.value;
    },
    cacheBarangays(state, payload) {
      const { province, municipality, barangays } = payload;
      if (!state.barangaysCache[province]) {
        state.barangaysCache[province] = {};
      }
      state.barangaysCache[province][municipality] = barangays;
    },
    cacheSuggestions(state, payload) {
      const { province, municipality, barangay, searchText, suggestions } =
        payload;
      if (!state.suggestionsCache[province]?.[municipality]?.[barangay]) {
        console.log("caching...", suggestions);
        state.suggestionsCache[province] = {};
        state.suggestionsCache[province][municipality] = {};
        state.suggestionsCache[province][municipality][barangay] = {};
      }

      state.suggestionsCache[province][municipality][barangay][searchText] =
        suggestions;
    },
    setIsSuggestionsReady(state, payload) {
      state.isSuggestionsReady = payload.value;
    },
  },
  actions: {
    async updateSuggestions({ state, commit }) {
      commit({ type: "setIsSuggestionsReady", value: false });
      const { province, municipality, barangay, searchText, suggestionsCache } =
        state;
      if (province && municipality && barangay) {
        const cachedSuggestions =
          suggestionsCache[province]?.[municipality]?.[barangay]?.[searchText];

        if (cachedSuggestions) {
          commit({ type: "setSuggestions", value: cachedSuggestions });
        } else {
          let url = `http://localhost:3000/autocomplete?province=${province}&municipality=${municipality}&barangay=${barangay}&searchText=${searchText}`;
          const suggestions = await axios
            .get(url)
            .then((res) => {
              return res.data;
            })
            .catch((e) => console.error(e));

          commit({
            type: "setSuggestions",
            value: suggestions,
          });
          commit({
            type: "cacheSuggestions",
            province,
            municipality,
            barangay,
            searchText,
            suggestions,
          });
        }
      }
      commit({ type: "setIsSuggestionsReady", value: true });
    },
    async updateBarangays({ state, commit }) {
      const { province, municipality, barangaysCache } = state;
      if (province && municipality) {
        // check if barangays were cached first
        const cachedBarangays = barangaysCache[province]?.[municipality];

        if (cachedBarangays) {
          commit({
            type: "setBarangays",
            value: cachedBarangays,
          });
        } else {
          // else fetch it from the api
          let url = `https://demo.myruntime.com/website/fulfillmentClustersService/api/getPhilClusterOptions/myruntimeWeb?parentOption=${province}&childOption=${municipality}`;

          const barangays = await axios
            .get(url)
            .then((res) => {
              return res.data.data;
            })
            .catch((e) => console.error(e));

          commit({
            type: "setBarangays",
            value: barangays,
          });

          // cache the fetched barangays
          commit({
            type: "cacheBarangays",
            province,
            municipality,
            barangays,
          });
        }
      }
    },
    resetInput({ commit }) {
      commit({
        type: "setProvince",
        value: "",
      });
      commit({
        type: "setBarangay",
        value: "",
      });
      commit({
        type: "setMunicipality",
        value: "",
      });
      commit({
        type: "setSearchText",
        value: "",
      });
    },
  },
  modules: {},
});
