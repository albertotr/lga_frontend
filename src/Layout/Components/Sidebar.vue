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
        <sidebar-menu
          :menu="getMenu()"
          showOneChild
        />
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
            title: "Mensagens",
            icon: "pe-7s-mail",
            href: "/manage/message",
          }
        );
      }

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
