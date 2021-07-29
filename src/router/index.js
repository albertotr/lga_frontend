import Vue from "vue";
import Router from "vue-router";
import store from "../store";

import Users from "../Pages/Admin/Users";
import Machines from "../Pages/Admin/Machines";

Vue.use(Router);

const router = new Router({
  scrollBehavior () {
    return window.scrollTo({ top: 0, behavior: "smooth" });
  },
  mode: "history",
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
      path: "/admin/users",
      name: "users",
      component: Users,
    },

    {
      path: "/admin/machines",
      name: "machines",
      component: Machines,
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
  ];
}

export default router;
