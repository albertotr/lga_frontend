import Vue from "vue";
import Router from "vue-router";
import store from "../store";

import Users from "../Pages/Admin/Users";
import Machines from "../Pages/Admin/Machines";
import Logs from "../Pages/Admin/Log";
import PageNotFound from "../Pages/UserPages/404";
import PageNotPermited from "../Pages/UserPages/403";
import ManageMachines from "../Pages/Manager/Machine/Machines";
import ManageMessages from "../Pages/Manager/Messages/Messages";
import Devices from "../Pages/Admin/Devices";
import Types from "../Pages/Admin/Types";
import Samples from "../Pages/Admin/Samples";
import Partners from "../Pages/Admin/Partners";

Vue.use(Router);

const router = new Router({
  scrollBehavior () {
    return window.scrollTo({ top: 0, behavior: "smooth" });
  },
  mode: "history",
  base: process.env.BASE_URL,
  routes: configRoutes(),
});

router.beforeEach((to, from, next) => {
  if (to.path != "/login" && to.path != '/forgot-password' && !store.getters.authenticated) {
    if (localStorage.getItem("token")) {
      store.dispatch("checkToken").then(() => next());
    } else {
      next({
        path: "/login",
        params: { nextUrl: to.fullPath },
      });
    }
  } else {
    next();
  }
});

function configRoutes () {
  return [
    // Admin pages
    {
      path: "/admin/user",
      name: "users",
      component: Users,
    },

    {
      path: "/admin/machine",
      name: "machines",
      component: Machines,
    },

    {
      path: "/admin/device",
      name: "devices",
      component: Devices,
    },

    {
      path: "/admin/type",
      name: "types",
      component: Types,
    },

    {
      path: "/admin/sample",
      name: "samples",
      component: Samples
    },

    {
      path: "/admin/parner",
      name: "partners",
      component: Partners
    },

    // Manage pages
    {
      path: "/manage/machine",
      name: "managemachines",
      component: ManageMachines,
    },

    // Manage pages
    {
      path: "/manage/message",
      name: "managemessages",
      component: ManageMessages,
    },

    // Sistem pages
    {
      path: "/admin/log",
      name: "Logs",
      component: Logs,
    },


    // Dashboards

    {
      path: "/",
      name: "analytics",
      component: () => import("../Pages/Dashboards/Analytics.vue"),
    },

    // Pages

    {
      path: "/login",
      name: "login",
      meta: { layout: "userpages" },
      component: () => import("../Pages/UserPages/Login.vue"),
    },
    {
      path: "/forgot-password",
      name: "forgot-password",
      meta: { layout: "userpages" },
      component: () => import("../Pages/UserPages/ForgotPassword.vue"),
    },

    /* page not fount */
    { path: "*", component: PageNotFound },
    { path: "/404", component: PageNotFound },

    //not permission
    { path: "/403", component: PageNotPermited },
  ];
}

export default router;
