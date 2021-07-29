<template>
  <div>
    <b-alert
      :show="dismissCountDown"
      dismissible
      :variant="alertType"
      @dismissed="dismissCountDown = 0"
      @dismiss-count-down="countDownChanged"
    >
      <p>{{ alertMessage }}</p>
      <b-progress
        :variant="alertType"
        :max="dismissSecs"
        :value="dismissCountDown"
        height="4px"
      ></b-progress>
    </b-alert>
    <page-title
      :heading="heading"
      :subheading="subheading"
      :icon="icon"
      @clearForm="clearForm"
    ></page-title>
    <div class="content">
      <user-form
        :form="user_selected"
        :showForm.sync="showForm"
        :user="user_selected"
        @updateDataTable="reloadDataTable"
        v-if="showForm"
      ></user-form>

      <b-table
        :items="users"
        :fields="fields"
        striped
        bordered
        hover
        :busy="loadingTableResult"
        responsive="sm"
        v-show="!showForm"
      >
        <template #cell(action)="obj">
          <font-awesome-icon
            icon="edit"
            size="2x"
            class="text-info"
            @click="onEditUser(obj.item)"
            v-if="permissions.includes('update-user')"
          />
          &nbsp;
          <font-awesome-icon
            icon="trash"
            size="2x"
            class="text-danger"
            @click="onDeleteUser(obj.item)"
            v-if="permissions.includes('delete-user')"
          />
        </template>

        <template #table-busy>
          <div class="text-center text-danger my-2">
            <b-spinner class="align-middle"></b-spinner>
            <strong>Carregando...</strong>
          </div>
        </template>
      </b-table>
    </div>
  </div>
</template>

<script>
import PageTitle from "../../Layout/Components/PageTitleAdd.vue";
import { mapGetters } from "vuex";
import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import UserForm from "./UserForm.vue";

library.add(faEdit, faTrash);

export default {
  name: "Users",
  components: {
    PageTitle,
    "font-awesome-icon": FontAwesomeIcon,
    UserForm,
  },
  data() {
    return {
      heading: "Administração de Usuários",
      subheading: "Verifique os dados antes de executar as ações.",
      icon: "fa-users text-success",
      users: null,
      user_selected: null,
      fields: [
        { key: "name", label: "Nome" },
        { key: "email", label: "E-Mail" },
        { key: "role.name", label: "Perfil" },
        { key: "action", label: "Ações" },
      ],
      showForm: false,
      dismissSecs: 10,
      dismissCountDown: 0,
      alertType: "success",
      alertMessage: "",
    };
  },
  created() {
    this.reloadDataTable();
  },
  methods: {
    onEditUser(user) {
      this.user_selected = user;
      this.showForm = true;
    },
    onDeleteUser(user) {
      this.boxTwo = "";
      this.$bvModal
        .msgBoxConfirm(`Deseja realmente excluir o usuário ${user.name}?`, {
          title: "Confirme a exclusão",
          size: "sm",
          buttonSize: "sm",
          okVariant: "success",
          okTitle: "Sim",
          cancelTitle: "Não",
          footerClass: "p-2",
          hideHeaderClose: false,
        })
        .then((confirm) => {
          if (confirm) {
            const token = localStorage.getItem("token");
            var Options = {
              method: "delete",
              url: `/api/users/${user.id}`,
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-type": "Application/Json",
              },
            };
            axios(Options).then((response) => {
              if (response.data) {
                this.alertType = "success";
                this.alertMessage = "Usuário excluido com sucesso.";
                this.dismissCountDown = this.dismissSecs;
                this.users.splice(this.users.indexOf(user), 1);
              } else {
                this.alertType = "danger";
                this.alertMessage = "Problemas ao excluir o usuário!";
                this.dismissCountDown = this.dismissSecs;
              }
            });
          }
        });
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown;
    },
    clearForm() {
      this.user_selected = null;
      this.showForm = true;
    },
    reloadDataTable(value) {
      if (value || value === undefined) {
        const token = localStorage.getItem("token");
        var Options = {
          method: "get",
          url: "/api/users/",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        axios(Options).then((response) => {
          this.users = response.data;
        });
      } else if (value === false) {
        this.alertType = "warning";
        this.alertMessage = "Problemas ao inserir o usuário";
        this.dismissCountDown = this.dismissSecs;
      }

      if (value) {
        this.alertType = "success";
        this.alertMessage = `Usuário inserido/editado com sucesso.`;
        this.dismissCountDown = this.dismissSecs;
      }
    },
  },
  computed: {
    ...mapGetters(["permissions"]),
    loadingTableResult() {
      return this.users == null;
    },
  },
};
</script>

<style></style>
