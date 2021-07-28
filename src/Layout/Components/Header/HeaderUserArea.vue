<template>
  <div class="d-flex">
    <div class="header-btn-lg pr-0">
      <div class="widget-content p-0">
        <div class="widget-content-wrapper">
          <div class="widget-content-left">
            <b-dropdown
              toggle-class="p-0 mr-2"
              menu-class="dropdown-menu-lg"
              variant="link"
              right
            >
              <span slot="button-content">
                <div class="font-icon-wrapper font-icon-lg">
                  <i class="pe-7s-users icon-gradient bg-sunny-morning"> </i>
                </div>
              </span>
              <button
                type="button"
                tabindex="0"
                class="dropdown-item"
                @click="logout"
              >
                Sair
              </button>
            </b-dropdown>
          </div>
          <div class="widget-content-left  ml-3 header-user-info" v-if="user">
            <div class="widget-heading">{{ user.name }}</div>
            <div class="widget-subheading">{{ user.role.name }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import { mapGetters } from "vuex";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faAngleDown,
  faCalendarAlt,
  faTrashAlt,
  faCheck,
  faFileAlt,
  faCloudDownloadAlt,
  faFileExcel,
  faFilePdf,
  faFileArchive,
  faEllipsisH,
} from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(
  faAngleDown,
  faCalendarAlt,
  faTrashAlt,
  faCheck,
  faFileAlt,
  faCloudDownloadAlt,
  faFileExcel,
  faFilePdf,
  faFileArchive,
  faEllipsisH
);

import store from "../../../store";
export default {
  components: {
    // "font-awesome-icon": FontAwesomeIcon,
  },
  data: () => ({}),

  methods: {
    logout() {
      store.dispatch("signOut");
    },
  },
  computed: {
    ...mapGetters(["user"]),
  },
};
</script>
