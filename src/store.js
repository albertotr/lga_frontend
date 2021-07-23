import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

const state = {
  sidebarShow: "responsive",
  sidebarMinimize: false,
  authenticated: false,
  token: null,
  user: null,
};

const getters = {
  authenticated(state) {
    return state.authenticated;
  },

  user(state) {
    return state.user;
  },

  token(state) {
    return state.token;
  },
};

const mutations = {
  toggleSidebarDesktop(state) {
    const sidebarOpened = [true, "responsive"].includes(state.sidebarShow);
    state.sidebarShow = sidebarOpened ? false : "responsive";
  },
  toggleSidebarMobile(state) {
    const sidebarClosed = [false, "responsive"].includes(state.sidebarShow);
    state.sidebarShow = sidebarClosed ? true : "responsive";
  },
  set(state, [variable, value]) {
    state[variable] = value;
  },
  SET_AUTHENTICATED(state, value) {
    state.authenticated = value;
  },
  SET_TOKEN(state, value) {
    state.token = value;
  },
  SET_USER(state, value) {
    state.user = value;
  },
};

const actions = {
  signIn({ dispatch }, credentials) {
    return new Promise((resolve, reject) => {
      axios
        .get("/sanctum/csrf-cookie")
        .then(() => {
          axios
            .post("/api/login", credentials)
            .then((response) => {
              dispatch("me", response.data)
                .then((retorno) => resolve(retorno))
                .catch((err) => reject(err));
            })
            .catch((err) => reject(err));
        })
        .catch((err) => reject(err));
    });
  },

  async signOut({ dispatch }) {
    await axios.post("/logout");
    return dispatch("me");
  },

  me({ commit }, token) {
    var getOptions = {
      method: "get",
      url: "/api/user/",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    return new Promise((resolve, reject) => {
      axios(getOptions)
        .then((response) => {
          commit("SET_AUTHENTICATED", true);
          commit("SET_TOKEN", token);
          commit("SET_USER", response.data);
          resolve(true);
        })
        .catch((err) => {
          commit("SET_AUTHENTICATED", false);
          commit("SET_TOKEN", null);
          commit("SET_USER", null);
          reject(err);
        });
    });
  },
};

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
});
