import Vue from "vue";
import Router from "vue-router";
import store from "../store";

import Users from "../Pages/Admin/User/Users";
import User from "../Pages/Admin/User/UserForm";
import Machines from "../Pages/Admin/Machine/Machines";
import Machine from "../Pages/Admin/Machine/MachineForm";
import Logs from "../Pages/Admin/Log";
import PageNotFound from "../Pages/UserPages/404";
import PageNotPermited from "../Pages/UserPages/403";
import ManageMachines from "../Pages/Manager/Machine/Machines";
import ManageMessages from "../Pages/Manager/Messages/Messages";
import Devices from "../Pages/Admin/Device/Devices";
import Device from "../Pages/Admin/Device/DeviceForm";
import Types from "../Pages/Admin/Type/Types";
import Type from "../Pages/Admin/Type/TypeForm";
import Samples from "../Pages/Admin/Sample/Samples";
import Sample from "../Pages/Admin/Sample/SampleForm";
import Partners from "../Pages/Admin/Partner/Partners";
import Partner from "../Pages/Admin/Partner/PartnerForm";
import Operators from "../Pages/Admin/Operator/Operators";
import Operator from "../Pages/Admin/Operator/OperatorForm";
import Locations from "../Pages/Admin/Location/Locations";
import Location from "../Pages/Admin/Location/LocationForm";
import MachineMessages from "../Pages/Manager/Machine/Messages";
import MachineTransactions from "../Pages/Manager/Machine/Transactions";
import MachineEditForm from "../Pages/Manager/Machine/Machine";
import ManageLocations from "../Pages/Manager/Location/Locations";
import LocationEditForm from "../Pages/Manager/Location/Location";
import Closures from "../Pages/Manager/Closure/Closures";
import Closure from "../Pages/Manager/Closure/Closure";
import ClosureTransactions from "../Pages/Manager/Closure/Transactions";
import Settings from "../Pages/UserPages/Settings";

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
      path: "/admin/user/edit/:user?",
      name: "adminuseredit",
      component: User,
    },

    {
      path: "/admin/machine",
      name: "machines",
      component: Machines,
    },
    {
      path: "/admin/machine/edit/:machine?",
      name: "adminmachineedit",
      component: Machine,
    },

    {
      path: "/admin/device",
      name: "devices",
      component: Devices,
    },
    {
      path: "/admin/device/edit/:device?",
      name: "device",
      component: Device,
    },

    {
      path: "/admin/type",
      name: "types",
      component: Types,
    },
    {
      path: "/admin/type/edit/:type?",
      name: "type",
      component: Type,
    },

    {
      path: "/admin/sample",
      name: "samples",
      component: Samples
    },
    {
      path: "/admin/sample/edit/:sample?",
      name: "sample",
      component: Sample,
    },

    {
      path: "/admin/parner",
      name: "partners",
      component: Partners
    },
    {
      path: "/admin/partner/edit/:partner?",
      name: "partner",
      component: Partner
    },

    {
      path: "/admin/operator",
      name: "operators",
      component: Operators
    },
    {
      path: "/admin/operator/edit/:operator?",
      name: "operator",
      component: Operator
    },

    {
      path: "/admin/location",
      name: "locations",
      component: Locations
    },
    {
      path: "/admin/location/edit/:location?",
      name: "location",
      component: Location
    },

    // Manage pages
    {
      path: "/manage/machine",
      name: "managemachines",
      component: ManageMachines,
    },

    {
      path: "/manage/machine/messages",
      name: "managemachinemessages",
      component: MachineMessages,
    },

    {
      path: "/manage/machine/edit/:machine",
      name: "managemachineedit",
      component: MachineEditForm,
    },    

    {
      path: "/manage/machine/transactions",
      name: "managemachinetransactions",
      component: MachineTransactions,
    },

    {
      path: "/manage/message",
      name: "managemessages",
      component: ManageMessages,
    },

    {
      path: "/manage/location",
      name: "managelocations",
      component: ManageLocations
    },

    {
      path: "/manage/location/edit/:location",
      name: "managelocationedit",
      component: LocationEditForm,
    },
    
    {
      path: "/manage/closure",
      name: "manageclosure",
      component: Closures,
    },
    {
      path: "/manage/closure/add",
      name: "manageclosureadd",
      component: Closure,
    },
    {
      path: "/manage/closure/transactions/:closure",
      name: "manageclosuretransactions",
      component: ClosureTransactions,
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
      name: "initial",
      component: () => import("../Pages/Dashboards/initial.vue"),
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
    {
      path: "/logout",
      name: "logout",
      meta: { layout: "userpages" },
      component: () => store.dispatch("signOut"),
    },
    {
      path: "/settings",
      name: "settings",
      component: Settings,
    },

    /* page not fount */
    { path: "*", component: PageNotFound },
    { path: "/404", component: PageNotFound },

    //not permission
    { path: "/403", component: PageNotPermited },
  ];
}

export default router;
