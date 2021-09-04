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
      :showForm.sync="showForm"
      @updateDataTable="reloadDataTable"
    ></page-title>
    <div class="content">
      <partner-form
        :showForm.sync="showForm"
        :partner="partner_selected"
        @updateDataTable="reloadDataTable"
        v-if="showForm"
      ></partner-form>

      <b-table
        :items="partners"
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
            @click="onEditPartner(obj.item)"
            v-if="
              permissions.includes('update-device') &&
                !obj.item.machine &&
                !obj.item.deleted_at
            "
          />
          &nbsp;
          <font-awesome-icon
            icon="trash"
            size="2x"
            class="text-danger"
            @click="onDeletePartner(obj.item)"
            v-if="
              permissions.includes('delete-device') &&
                !obj.item.machine &&
                !obj.item.deleted_at
            "
          />

          <font-awesome-icon
            icon="recycle"
            size="2x"
            class="text-warning"
            @click="onRestorePartner(obj.item)"
            v-if="permissions.includes('delete-device') && obj.item.deleted_at"
          />
          &nbsp;
          <font-awesome-icon
            icon="bomb"
            size="2x"
            class="text-danger"
            @click="onForceDeletePartner(obj.item)"
            v-if="
              permissions.includes('delete-device') &&
                obj.item.deleted_at &&
                obj.item.machine_count == '0'
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
import PageTitle from "../../Layout/Components/PageTitleAdd.vue";
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
import PartnerForm from "./PartnerForm.vue";

library.add(faEdit, faTrash, faRecycle, faBomb);

export default {
  name: "Partners",
  components: {
    PageTitle,
    "font-awesome-icon": FontAwesomeIcon,
    PartnerForm,
  },
  data() {
    return {
      heading: "Administração de Clientes",
      subheading: "Verifique os dados antes de executar as ações.",
      icon: "clipboard-list",
      partners: null,
      partner_selected: null,
      fields: [
        { key: "name", label: "Name" },
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
    onEditPartner(partner) {
      this.partner_selected = partner;
      this.showForm = true;
    },
    onDeletePartner(partner) {
      this.boxTwo = "";
      this.$bvModal
        .msgBoxConfirm(`Deseja realmente excluir o cliente ${partner.name}?`, {
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
                this.alertMessage = "Cliente excluido com sucesso.";
                this.dismissCountDown = this.dismissSecs;
                this.reloadDataTable();
              } else {
                this.alertType = "danger";
                this.alertMessage = "Problemas ao excluir o Cliente!";
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
          `Deseja realmente restaurar o cliente ${partner.name}?`,
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
    onForceDeletePartner(partner) {
      this.boxTwo = "";
      this.$bvModal
        .msgBoxConfirm(
          `Deseja excluir permanentemente o cliente ${partner.name}?`,
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
      this.partner_selected = null;
      this.showForm = true;
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
        this.alertMessage = `Cliente inserido/editado com sucesso.`;
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
