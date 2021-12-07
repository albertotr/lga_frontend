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
      @addForm="addForm"
    ></page-title>
    <div class="content">

      <b-table
        :items="partners"
        :fields="fields"
        striped
        bordered
        hover
        :busy="loadingTableResult"
        responsive="sm"
      >
        <template #cell(action)="obj">
          <router-link
            :to="{path: `/admin/partner/edit/${obj.item.id}`}"
            v-if="
              permissions.includes('update-partner') &&
                !obj.item.machine &&
                !obj.item.deleted_at
            "
          >
            <font-awesome-icon icon="edit" size="2x" class="text-info" />
          </router-link> 
          &nbsp;
          <font-awesome-icon
            icon="trash"
            size="2x"
            class="text-danger"
            @click="onDeletePartner(obj.item)"
            v-if="
              permissions.includes('delete-partner') &&
                obj.item.machines_count == 0 &&
                !obj.item.deleted_at
            "
          />

          <font-awesome-icon
            icon="recycle"
            size="2x"
            class="text-warning"
            @click="onRestorePartner(obj.item)"
            v-if="permissions.includes('delete-partner') && obj.item.deleted_at"
          />
          &nbsp;
          <font-awesome-icon
            icon="bomb"
            size="2x"
            class="text-danger"
            @click="onForceDeletePartner(obj.item)"
            v-if="
              permissions.includes('delete-partner') &&
                obj.item.deleted_at &&
                obj.item.machines_count == 0
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
import {
  faEdit,
  faTrash,
  faRecycle,
  faBomb,
} from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";

library.add(faEdit, faTrash, faRecycle, faBomb);

export default {
  name: "Partners",
  components: {
    PageTitle,
    "font-awesome-icon": FontAwesomeIcon,
  },
  data() {
    return {
      heading: "Administração de Parceiros",
      subheading: "Verifique os dados antes de executar as ações.",
      icon: "clipboard-list",
      partners: null,
      fields: [
        { key: "name", label: "Name" },
        { key: "action", label: "Ações" },
      ],
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
    addForm() {
      this.$router.push({path: `/admin/partner/edit`});
    },
    onDeletePartner(partner) {
      this.boxTwo = "";
      this.$bvModal
        .msgBoxConfirm(`Deseja realmente excluir o parceiro ${partner.name}?`, {
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
              url: `/api/partner/${partner.id}`,
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-type": "Application/Json",
              },
            };
            axios(Options).then((response) => {
              if (response.data) {
                this.alertType = "success";
                this.alertMessage = "Parceiro excluido com sucesso.";
                this.dismissCountDown = this.dismissSecs;
                this.reloadDataTable();
              } else {
                this.alertType = "danger";
                this.alertMessage = "Problemas ao excluir o Parceiro!";
                this.dismissCountDown = this.dismissSecs;
              }
            });
          }
        });
    },
    onRestorePartner(partner) {
      this.boxTwo = "";
      this.$bvModal
        .msgBoxConfirm(
          `Deseja realmente restaurar o parceiro ${partner.name}?`,
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
              url: `/api/partner/restore/${partner.id}`,
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-type": "Application/Json",
              },
            };
            axios(Options).then((response) => {
              if (response.data) {
                this.alertType = "success";
                this.alertMessage = "Parceiro restaurado com sucesso.";
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
    onForceDeletePartner(partner) {
      this.boxTwo = "";
      this.$bvModal
        .msgBoxConfirm(
          `Deseja excluir permanentemente o parceiro ${partner.name}?`,
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
              url: `/api/partner/forcedelete/${partner.id}`,
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-type": "Application/Json",
              },
            };
            axios(Options)
              .then((response) => {
                if (response.data) {
                  this.alertType = "success";
                  this.alertMessage = "Parceiro excluido permanentemente.";
                  this.dismissCountDown = this.dismissSecs;
                  this.reloadDataTable();
                } else {
                  this.alertType = "danger";
                  this.alertMessage = "Problemas ao excluir o parceiro!";
                  this.dismissCountDown = this.dismissSecs;
                }
              })
              .catch(() => {
                this.alertType = "danger";
                this.alertMessage =
                  "Problemas ao excluir o parceiro, provavelmente existe uma Máquina vinculada a este parceiro!";
                this.dismissCountDown = this.dismissSecs;
              });
          }
        });
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown;
    },
    reloadDataTable(value) {
      if (value !== undefined && value.status) {
        this.alertType = "warning";

        this.alertMessage = "Verifique o formulário ";
        this.dismissCountDown = this.dismissSecs;
      } else if (value || value === undefined) {
        const token = localStorage.getItem("token");
        var Options = {
          method: "get",
          url: "/api/partner/",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        axios(Options).then((response) => {
          this.partners = response.data;
        });
      }

      if (value === true) {
        this.alertType = "success";
        this.alertMessage = `Parceiro inserido/editado com sucesso.`;
        this.dismissCountDown = this.dismissSecs;
      }
    },
  },
  computed: {
    ...mapGetters(["permissions"]),
    loadingTableResult() {
      return this.partners == null;
    },
  },
};
</script>

<style></style>
