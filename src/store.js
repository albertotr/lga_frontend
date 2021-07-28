import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import router from "./router";

Vue.use(Vuex);

const state = {
  sidebarShow: "responsive",
  sidebarMinimize: false,
  authenticated: false,
  token: null,
  user: null,
};

const getters = {
  authenticated (state) {
    return state.authenticated;
  },

  user (state) {
    return state.user;
  },

  token (state) {
    return state.token;
  },

  permissions (state) {
    if (state.user) return state.user.role.permissions.map(permission => permission.name);
    else return [];
  }

};

const mutations = {
  toggleSidebarDesktop (state) {
    const sidebarOpened = [true, "responsive"].includes(state.sidebarShow);
    state.sidebarShow = sidebarOpened ? false : "responsive";
  },
  toggleSidebarMobile (state) {
    const sidebarClosed = [false, "responsive"].includes(state.sidebarShow);
    state.sidebarShow = sidebarClosed ? true : "responsive";
  },
  set (state, [variable, value]) {
    state[variable] = value;
  },
  SET_AUTHENTICATED (state, value) {
    state.authenticated = value;
  },
  SET_TOKEN (state, value) {
    state.token = value;
  },
  SET_USER (state, value) {
    state.user = value;
  },
};

const actions = {
  signIn ({ dispatch }, credentials) {
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

  checkToken ({ dispatch }) {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem("token");
      dispatch("me", token)
        .then((retorno) => resolve(retorno))
        .catch((err) => reject(err));
    });
  },

  signOut ({ commit }) {
    commit("SET_AUTHENTICATED", false);
    commit("SET_TOKEN", null);
    commit("SET_USER", null);
    const token = localStorage.getItem("token");
    localStorage.removeItem("token");

    var postOptions = {
      method: "post",
      url: "/api/logout/",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios(postOptions).then(() => {
      router.push('/login');
    });
  },

  me ({ commit }, token) {
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
          localStorage.setItem('token', token);
          resolve(true);
        })
        .catch((err) => {
          commit("SET_AUTHENTICATED", false);
          commit("SET_TOKEN", null);
          commit("SET_USER", null);
          localStorage.removeItem("token");
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
