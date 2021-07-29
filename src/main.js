import Vue from 'vue'
import router from './router'
import store from "./store";

import BootstrapVue from "bootstrap-vue"

import App from './App'

import Default from './Layout/Wrappers/baseLayout.vue';
import Pages from './Layout/Wrappers/pagesLayout.vue';

import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.VUE_APP_API_URL;

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    let response = error.response;
    if (error.response.status === 401) {
      localStorage.clear();
      sessionStorage.clear();
      if (response.config.url !== '/api/login') router.push("/login");
    } else if (error.response.status === 403) {
      if (response.config.url !== '/api/login') router.push("/login");
    }
    return Promise.reject(error);
  }
);

Vue.config.productionTip = false;

Vue.use(BootstrapVue);

Vue.component('default-layout', Default);
Vue.component('userpages-layout', Pages);

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
});
