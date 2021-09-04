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
      <device-form
        :showForm.sync="showForm"
        :device="device_selected"
        @updateDataTable="reloadDataTable"
        v-if="showForm"
      ></device-form>

      <b-table
        :items="devices"
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
            @click="onEditDevice(obj.item)"
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
            @click="onDeleteDevice(obj.item)"
            v-if="
              permissions.includes('delete-device') &&
                !obj.item.machine &&
                !obj.item.deleted_at
            "
          />
          &nbsp;
          <font-awesome-icon
            icon="recycle"
            size="2x"
            class="text-warning"
            @click="onRestoreDevice(obj.item)"
            v-if="permissions.includes('delete-device') && obj.item.deleted_at"
          />
          &nbsp;
          <font-awesome-icon
            icon="bomb"
            size="2x"
            class="text-danger"
            @click="onForceDeleteType(obj.item)"
            v-if="
              permissions.includes('delete-device') &&
                obj.item.deleted_at &&
                !obj.item.machine
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
import { faEdit, faTrash, faRecycle, faBomb } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import DeviceForm from "./DeviceForm.vue";

library.add(faEdit, faTrash, faRecycle, faBomb);

export default {
  name: "Devices",
  components: {
    PageTitle,
    "font-awesome-icon": FontAwesomeIcon,
    DeviceForm,
  },
  data() {
    return {
      heading: "Administração de Dispositivos",
      subheading: "Verifique os dados antes de executar as ações.",
      icon: "cogs",
      devices: null,
      device_selected: null,
      fields: [
        { key: "mac", label: "MAC" },
        { key: "machine.serial", label: "Maquina (serial)" },
        { key: "action", label: "Ações" },
      ],
      showForm: false,
      dismissSecs: 10,
      dismissCountDown: 0,
      alertType: "success",
      alertMessage: "Verifique o formulário",
    };
  },
  created() {
    this.reloadDataTable();
  },
  methods: {
    onEditDevice(device) {
      this.device_selected = device;
      this.showForm = true;
    },
    onDeleteDevice(device) {
      this.boxTwo = "";
      this.$bvModal
        .msgBoxConfirm(
          `Deseja realmente excluir o dispositivo de MAC ${device.mac}?`,
          {
            title: "Confirme a exclusão",
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
              url: `/api/device/${device.id}`,
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-type": "Application/Json",
              },
            };
            axios(Options).then((response) => {
              if (response.data) {
                this.alertType = "success";
                this.alertMessage = "Dispositivo excluido com sucesso.";
                this.dismissCountDown = this.dismissSecs;
                this.reloadDataTable();
              } else {
                this.alertType = "danger";
                this.alertMessage = "Problemas ao excluir o Dispositivo!";
                this.dismissCountDown = this.dismissSecs;
              }
            });
          }
        });
    },
    onRestoreDevice(device) {
      this.boxTwo = "";
      this.$bvModal
        .msgBoxConfirm(
          `Deseja realmente restaurar o dispositivo de MAC ${device.mac}?`,
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
              url: `/api/device/restore/${device.id}`,
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-type": "Application/Json",
              },
            };
            axios(Options).then((response) => {
              if (response.data) {
                this.alertType = "success";
                this.alertMessage = "Dispositivo restaurado com sucesso.";
                this.dismissCountDown = this.dismissSecs;
                this.reloadDataTable();
              } else {
                this.alertType = "danger";
                this.alertMessage = "Problemas ao restaurar o Dispositivo!";
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
      this.device_selected = null;
      this.showForm = true;
    },
    reloadDataTable(value) {
      if (value !== undefined && value.status) {
        this.alertType = "warning";
        this.dismissCountDown = this.dismissSecs;
      } else if (value || value === undefined) {
        const token = localStorage.getItem("token");
        var Options = {
          method: "get",
          url: "/api/device/",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        axios(Options).then((response) => {
          this.devices = response.data;
        });
      }

      if (value === true) {
        this.alertType = "success";
        this.alertMessage = `Dispositivo inserido/editado com sucesso.`;
        this.dismissCountDown = this.dismissSecs;
      }
    },
    onForceDeleteType(device) {
      this.boxTwo = "";
      this.$bvModal
        .msgBoxConfirm(`Deseja excluir permanentemente o dispositimo ${device.mac}?`, {
          title: "Confirme a Exclusão",
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
              url: `/api/device/forcedelete/${device.id}`,
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-type": "Application/Json",
              },
            };
            axios(Options)
              .then((response) => {
                if (response.data) {
                  this.alertType = "success";
                  this.alertMessage = "Dispositivo excluido permanentemente.";
                  this.dismissCountDown = this.dismissSecs;
                  this.reloadDataTable();
                } else {
                  this.alertType = "danger";
                  this.alertMessage = "Problemas ao excluir o Dispositivo!";
                  this.dismissCountDown = this.dismissSecs;
                }
              })
              .catch(() => {
                this.alertType = "danger";
                this.alertMessage =
                  "Problemas ao excluir o tipo, provavelmente existe uma Máquina vinculada a este Dispositivo!";
                this.dismissCountDown = this.dismissSecs;
              });
          }
        });
    }
  },
  computed: {
    ...mapGetters(["permissions"]),
    loadingTableResult() {
      return this.devices == null;
    },
  },
};
</script>

<style></style>
