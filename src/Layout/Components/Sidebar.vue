<template>
  <div
    class="app-sidebar sidebar-shadow"
    @mouseover="toggleSidebarHover('add', 'closed-sidebar-open')"
    @mouseleave="toggleSidebarHover('remove', 'closed-sidebar-open')"
  >
    <div class="app-header__logo">
      <h4>LGA</h4>
      <div class="header__pane ml-auto">
        <button
          type="button"
          class="hamburger close-sidebar-btn hamburger--elastic"
          v-bind:class="{ 'is-active': isOpen }"
          @click="toggleBodyClass('closed-sidebar')"
        >
          <span class="hamburger-box">
            <span class="hamburger-inner"></span>
          </span>
        </button>
      </div>
    </div>
    <div class="app-sidebar-content">
      <VuePerfectScrollbar class="app-sidebar-scroll" v-once v-if="user">
        <sidebar-menu :menu="getMenu()" showOneChild />
      </VuePerfectScrollbar>
    </div>
  </div>
</template>

<script>
import { SidebarMenu } from "vue-sidebar-menu";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import { mapGetters } from "vuex";
export default {
  components: {
    SidebarMenu,
    VuePerfectScrollbar,
  },
  data() {
    return {
      isOpen: false,
      windowWidth: 0,
      sidebarActive: false,
      collapsed: true,
    };
  },
  props: {
    sidebarbg: String,
  },
  methods: {
    getMenu() {
      var menu = [
        {
          title: "Inicio",
          icon: "pe-7s-home",
          href: "/",
        },
        {
          title: "Dashboard",
          icon: "pe-7s-display2",
          href: "/dashboard",
        },
      ];

      if (this.user.role.level == 0) {
        menu.push(
          {
            header: true,
            title: "Administrativo",
            hiddenOnCollapse: true,
          },
          {
            title: "Usuario",
            icon: "pe-7s-users",
            href: "/admin/user",
          },
          {
            title: "Maquinas",
            icon: "pe-7s-server",
            href: "/admin/machine",
          },
          {
            title: "Dispositivos",
            icon: "pe-7s-plugin",
            href: "/admin/device",
          },
          // {
          //   title: "Tipos",
          //   icon: "pe-7s-ticket",
          //   href: "/admin/type",
          // },
          // {
          //   title: "Modelos",
          //   icon: "pe-7s-ribbon",
          //   href: "/admin/sample",
          // },
          {
            title: "Parceiro",
            icon: "pe-7s-wristwatch",
            href: "/admin/parner",
          },
          {
            title: "Operador",
            icon: "pe-7s-tools",
            href: "/admin/operator",
          },
          {
            title: "Localização",
            icon: "pe-7s-map-2",
            href: "/admin/location",
          },
          {
            title: "Mensagens",
            icon: "pe-7s-mail",
            href: "/manage/message",
          },
          {
            title: "Ajuda",
            icon: "pe-7s-mail",
            href: "/admin/ajuda",
          }
          /* {
            header: true,
            title: "Sistema",
          },
          {
            title: "LOG",
            icon: "pe-7s-note2",
            href: "/admin/log",
          }, */
        );
      }

      if (this.user.role.level <= 3) {
        menu.push(
          {
            header: true,
            title: "Gerenciamento",
          },
          {
            title: "Maquinas",
            icon: "pe-7s-server",
            href: "/manage/machine",
          },
          {
            title: "Fechamentos",
            icon: "pe-7s-culture",
            href: "/manage/closure",
          },
          {
            title: "Localização",
            icon: "pe-7s-map-2",
            href: "/manage/location",
          },
          {
            title: "Relatorios",
            icon: "pe-7s-display2",
            child: [
              {
                href: "/manage/reports/operatortransaction",
                title: "Operador/Transação",
              },
              // {
              //   href: "/manage/location",
              //   title: "Operacional",
              // },
            ],
          },
          {
            title: "Ajuda",
            icon: "pe-7s-mail",
            href: "/manage/ajuda",
          }
        );
      }

      menu.push(
        {
          header: true,
          title: "Sistema",
        },
        {
          title: "Sair",
          icon: "pe-7s-door-lock",
          href: "/logout",
        },
        {
          title: "Configuração",
          icon: "pe-7s-config",
          href: "/settings",
        }
      );

      return menu;
    },
    toggleBodyClass(className) {
      const el = document.body;
      this.isOpen = !this.isOpen;

      if (this.isOpen) {
        el.classList.add(className);
      } else {
        el.classList.remove(className);
      }
    },
    toggleSidebarHover(add, className) {
      const el = document.body;
      this.sidebarActive = !this.sidebarActive;

      this.windowWidth = document.documentElement.clientWidth;

      if (this.windowWidth > "992") {
        if (add === "add") {
          el.classList.add(className);
        } else {
          el.classList.remove(className);
        }
      }
    },
    getWindowWidth() {
      const el = document.body;

      this.windowWidth = document.documentElement.clientWidth;

      if (this.windowWidth < "1350") {
        el.classList.add("closed-sidebar", "closed-sidebar-md");
      } else {
        el.classList.remove("closed-sidebar", "closed-sidebar-md");
      }
    },
  },
  mounted() {
    this.$nextTick(function() {
      window.addEventListener("resize", this.getWindowWidth);

      //Init
      this.getWindowWidth();
    });
    this.toggleBodyClass("closed-sidebar");
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.getWindowWidth);
  },
  computed: {
    ...mapGetters(["user"]),
  },
};
</script>

<style lang="scss" scoped></style>
