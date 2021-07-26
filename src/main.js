import "core-js/stable";
import Vue from "vue";
import App from "./App";
import router from "./router";
import CoreuiVue from "@coreui/vue";
import { iconsSet as icons } from "./assets/icons/icons.js";
import store from "./store";
import axios from "axios";

Vue.config.performance = true;
Vue.use(CoreuiVue);
Vue.prototype.$log = console.log.bind(console);

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.VUE_APP_API_URL;

axios.interceptors.response.use(
  function(response) {
    return response;
  },
  function(error) {
    if (error.response.status === 401) {
      console.info("auth token expired");
      localStorage.clear();
      sessionStorage.clear();
      router.push("/pages/login");
      Promise.reject(error);
    } else if (error.response.status === 403) {
      router.push("/pages/login");
      Promise.reject(error);
    } else {
      return Promise.reject(error);
    }
  }
);

new Vue({
  el: "#app",
  router,
  store,
  icons,
  template: "<App/>",
  components: {
    App,
  },
});
