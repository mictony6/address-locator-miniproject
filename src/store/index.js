import { createStore } from "vuex";

export default createStore({
  state: {
    options: null,
    province: "",
    municipality: "",
    barangays: [],
    barangay: "",
    searchText: "",
    suggestions: [],
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
  },
  actions: {
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
