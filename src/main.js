import Vue from 'vue'
import router from './router'
import store from "./store";

import BootstrapVue from "bootstrap-vue"

import App from './App'

import Default from './Layout/Wrappers/baseLayout.vue';
import Pages from './Layout/Wrappers/pagesLayout.vue';

import axios from "axios";

import VueTheMask from 'vue-the-mask'
Vue.use(VueTheMask)

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.VUE_APP_API_URL;
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.get['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.delete['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.put['Access-Control-Allow-Origin'] = '*';

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
      router.push("/403")
      alert('O sistema identificou que seu usuário, não possui direitos suficientes para processar está requisição. Refaça sua autenticação ou contate o administrador')
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
