import Vue from "vue";
import Router from "vue-router";
import store from "../store";

import Users from "../Pages/Admin/Users";

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

    // Elements

    {
      path: "/elements/buttons-standard",
      name: "buttons-standard",
      component: () => import("../Pages/Elements/Buttons/Standard.vue"),
    },
    {
      path: "/elements/dropdowns",
      name: "dropdowns",
      component: () => import("../Pages/Elements/Dropdowns.vue"),
    },
    {
      path: "/elements/icons",
      name: "icons",
      component: () => import("../Pages/Elements/Icons.vue"),
    },
    {
      path: "/elements/badges-labels",
      name: "badges",
      component: () => import("../Pages/Elements/Badges.vue"),
    },
    {
      path: "/elements/cards",
      name: "cards",
      component: () => import("../Pages/Elements/Cards.vue"),
    },
    {
      path: "/elements/list-group",
      name: "list-group",
      component: () => import("../Pages/Elements/ListGroups.vue"),
    },
    {
      path: "/elements/timelines",
      name: "timeline",
      component: () => import("../Pages/Elements/Timeline.vue"),
    },
    {
      path: "/elements/utilities",
      name: "utilities",
      component: () => import("../Pages/Elements/Utilities.vue"),
    },

    // Components

    {
      path: "/components/tabs",
      name: "tabs",
      component: () => import("../Pages/Components/Tabs.vue"),
    },
    {
      path: "/components/accordions",
      name: "accordions",
      component: () => import("../Pages/Components/Accordions.vue"),
    },
    {
      path: "/components/modals",
      name: "modals",
      component: () => import("../Pages/Components/Modals.vue"),
    },
    {
      path: "/components/progress-bar",
      name: "progress-bar",
      component: () => import("../Pages/Components/ProgressBar.vue"),
    },
    {
      path: "/components/tooltips-popovers",
      name: "tooltips-popovers",
      component: () => import("../Pages/Components/TooltipsPopovers.vue"),
    },
    {
      path: "/components/carousel",
      name: "carousel",
      component: () => import("../Pages/Components/Carousel.vue"),
    },
    {
      path: "/components/pagination",
      name: "pagination",
      component: () => import("../Pages/Components/Pagination.vue"),
    },
    {
      path: "/components/maps",
      name: "maps",
      component: () => import("../Pages/Components/Maps.vue"),
    },

    // Tables

    {
      path: "/tables/regular-tables",
      name: "regular-tables",
      component: () => import("../Pages/Tables/RegularTables.vue"),
    },

    // Dashboard Widgets

    {
      path: "/widgets/chart-boxes-3",
      name: "chart-boxes-3",
      component: () => import("../Pages/Widgets/ChartBoxes3.vue"),
    },

    // Forms

    {
      path: "/forms/controls",
      name: "controls",
      component: () => import("../Pages/Forms/Elements/Controls.vue"),
    },
    {
      path: "/forms/layouts",
      name: "layouts",
      component: () => import("../Pages/Forms/Elements/Layouts.vue"),
    },
    // Charts

    {
      path: "/charts/chartjs",
      name: "chartjs",
      component: () => import("../Pages/Charts/Chartjs.vue"),
    },
  ];
}

export default router;
