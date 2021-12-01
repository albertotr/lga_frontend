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
                @click="changePass"
              >
                Alterar Senha
              </button>
              <div tabindex="-1" class="dropdown-divider"></div>
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
    <b-modal
      id="modalChangePass"
      title="Alterar senha de usuário"
      size="sm"
      okVariant="success"
      okTitle="Alterar"
      cancelTitle="Cancelar"
      footerClass="p-2"
      @ok="confirmPassChange"
    >
      <label for="password">Nova Senha</label>
      <input
        type="password"
        class="form-control"
        placeholder="Password"
        v-model="password"
        @focus="error = false"
      />
      <small id="passwordHelp" class="form-text text-muted">
        A nova senha precisa conter no mínimo

        <span :class="has_minimum_lenth ? 'has_required' : ''"> 8 digitos</span
        >,
        <span :class="has_lowercase ? 'has_required' : ''"
          >uma letra minuscula</span
        >,
        <span :class="has_uppercase ? 'has_required' : ''"
          >uma letra maiuscula</span
        >, <span :class="has_number ? 'has_required' : ''">um número</span>, e
        <span :class="has_special ? 'has_required' : ''"
          >um caracter especial.</span
        >
      </small>

      <small style="color:red" v-if="error">
        Verifique a regra acima. A senha não obedece as regras definidas.
      </small>
    </b-modal>
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
import axios from "axios";
export default {
  components: {
    // "font-awesome-icon": FontAwesomeIcon,
  },
  data: () => ({
    password: "",
    has_minimum_lenth: false,
    has_number: false,
    has_lowercase: false,
    has_uppercase: false,
    has_special: false,
    error: false,
  }),

  methods: {
    logout() {
      store.dispatch("signOut");
    },
    changePass() {
      this.$bvModal.show("modalChangePass");
    },
    confirmPassChange(bvModalEvt) {
      if (
        !this.has_minimum_lenth ||
        !this.has_number ||
        !this.has_lowercase ||
        !this.has_uppercase ||
        !this.has_special
      ) {
        this.error = true;
        bvModalEvt.preventDefault();
        return false;
      }

      const token = localStorage.getItem("token");
      var Options = {
        method: "PUT",
        url: "/api/user/password/" + this.user.id,
        data: {
          password: this.password,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      axios(Options)
        .then(() => {
          this.$bvModal.msgBoxOk("Senha do usuário foi alterado com sucesso.", {
            title: "Mensagem!",
            size: "sm",
            buttonSize: "sm",
            okVariant: "info",
            okTitle: "OK",
            hideHeaderClose: false,
          });
        })
        .catch(() => {
          this.$bvModal.msgBoxOk(
            "Problema ao alterar a senha, tente novamente ou contate o suporte.",
            {
              title: "Aviso!",
              size: "sm",
              buttonSize: "sm",
              okVariant: "danger",
              okTitle: "OK",
              hideHeaderClose: false,
            }
          );
        });
    },
  },
  computed: {
    ...mapGetters(["user"]),
  },
  watch: {
    password() {
      this.has_minimum_lenth = this.password.length > 8;
      this.has_number = /\d/.test(this.password);
      this.has_lowercase = /[a-z]/.test(this.password);
      this.has_uppercase = /[A-Z]/.test(this.password);
      this.has_special = /[!@#\\$%\\^\\&*\\)\\(+=._-]/.test(this.password);
    },
  },
};
</script>

<style scoped>
.has_required {
  text-decoration: line-through;
  color: #689868;
}
</style>
