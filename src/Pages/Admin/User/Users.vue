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
      @updateDataTable="reloadDataTable"
      :showForm.sync="showForm"
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
            v-if="permissions.includes('update-user') && !obj.item.deleted_at"
          />
          &nbsp;
          <font-awesome-icon
            icon="trash"
            size="2x"
            class="text-danger"
            @click="onDeleteUser(obj.item)"
            v-if="permissions.includes('delete-user') && !obj.item.deleted_at"
          />
          <font-awesome-icon
            icon="recycle"
            size="2x"
            class="text-warning"
            @click="onRestoreUser(obj.item)"
            v-if="permissions.includes('delete-device') && obj.item.deleted_at"
          />
          &nbsp;
          <font-awesome-icon
            icon="bomb"
            size="2x"
            class="text-danger"
            @click="onForceDeleteUser(obj.item)"
            v-if="
              permissions.includes('delete-device') &&
                obj.item.deleted_at
            "
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
import PageTitle from "../../../Layout/Components/PageTitleAdd.vue";
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
      icon: "users-cog",
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
              url: `/api/user/${user.id}`,
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
                this.reloadDataTable();
              } else {
                this.alertType = "danger";
                this.alertMessage = "Problemas ao excluir o usuário!";
                this.dismissCountDown = this.dismissSecs;
              }
            });
          }
        });
    },
    onRestoreUser(user) {
      this.boxTwo = "";
      this.$bvModal
        .msgBoxConfirm(
          `Deseja realmente restaurar o usuario ${user.name}?`,
          {
            title: "Confirme a Restauração",
            size: "sm",
            buttonSize: "sm",
            okVariant: "success",
            okTitle: "Sim",
            cancelTitle: "Não",
            footerClass: "p-2",
            hideHeaderClose: false,
          }
        )
        .then((confirm) => {
          if (confirm) {
            const token = localStorage.getItem("token");
            var Options = {
              method: "get",
              url: `/api/user/restore/${user.id}`,
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-type": "Application/Json",
              },
            };
            axios(Options).then((response) => {
              if (response.data) {
                this.alertType = "success";
                this.alertMessage = "Cliente restaurado com sucesso.";
                this.dismissCountDown = this.dismissSecs;
                this.reloadDataTable();
              } else {
                this.alertType = "danger";
                this.alertMessage = "Problemas ao restaurar o tipo!";
                this.dismissCountDown = this.dismissSecs;
              }
            });
          }
        });
    },
    onForceDeleteUser(user) {
      this.boxTwo = "";
      this.$bvModal
        .msgBoxConfirm(
          `Deseja excluir permanentemente o usuario ${user.name}?`,
          {
            title: "Confirme a Exclusão",
            size: "sm",
            buttonSize: "sm",
            okVariant: "success",
            okTitle: "Sim",
            cancelTitle: "Não",
            footerClass: "p-2",
            hideHeaderClose: false,
          }
        )
        .then((confirm) => {
          if (confirm) {
            const token = localStorage.getItem("token");
            var Options = {
              method: "delete",
              url: `/api/user/forcedelete/${user.id}`,
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-type": "Application/Json",
              },
            };
            axios(Options)
              .then((response) => {
                if (response.data) {
                  this.alertType = "success";
                  this.alertMessage = "Cliente excluido permanentemente.";
                  this.dismissCountDown = this.dismissSecs;
                  this.reloadDataTable();
                } else {
                  this.alertType = "danger";
                  this.alertMessage = "Problemas ao excluir o cliente!";
                  this.dismissCountDown = this.dismissSecs;
                }
              })
              .catch(() => {
                this.alertType = "danger";
                this.alertMessage =
                  "Problemas ao excluir o cliente, provavelmente existe uma Máquina vinculada a este cliente!";
                this.dismissCountDown = this.dismissSecs;
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
          url: "/api/user/",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        axios(Options).then((response) => {
          this.users = response.data;
        });
      } else if (value === false) {
        this.alertType = "warning";
        this.alertMessage = "Verifique o formulário.";
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
