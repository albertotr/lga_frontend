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
      <machine-form
        :showForm.sync="showForm"
        :machine="machine_selected"
        @updateDataTable="reloadDataTable"
        v-if="showForm"
      ></machine-form>

      <b-table
        :items="machines"
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
            @click="onEditMachine(obj.item)"
            v-if="permissions.includes('update-machine')"
          />
          &nbsp;
          <font-awesome-icon
            icon="trash"
            size="2x"
            class="text-danger"
            @click="onDeleteMachine(obj.item)"
            v-if="permissions.includes('delete-machine')"
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
import MachineForm from "./MachineForm.vue";

library.add(faEdit, faTrash);

export default {
  name: "Machines",
  components: {
    PageTitle,
    "font-awesome-icon": FontAwesomeIcon,
    MachineForm,
  },
  data() {
    return {
      heading: "Administração de Máquinas",
      subheading: "Verifique os dados antes de executar as ações.",
      icon: "fa-users text-success",
      machines: null,
      machine_selected: null,
      fields: [
        { key: "serial", label: "Serial" },
        { key: "type.name", label: "Tipo" },
        { key: "sample.name", label: "Modelo" },
        { key: "device.mac", label: "MAC" },
        { key: "partner.name", label: "Cliente" },
        { key: "sample.slot", label: "Slot" },
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
    onEditMachine(machine) {
      this.machine_selected = machine;
      this.showForm = true;
    },
    onDeleteMachine(machine) {
      this.boxTwo = "";
      this.$bvModal
        .msgBoxConfirm(
          `Deseja realmente excluir o maquina de serial ${machine.serial}?`,
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
              url: `/api/machine/${machine.id}`,
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-type": "Application/Json",
              },
            };
            axios(Options).then((response) => {
              if (response.data) {
                this.alertType = "success";
                this.alertMessage = "Máquina excluida com sucesso.";
                this.dismissCountDown = this.dismissSecs;
                this.machines.splice(this.machines.indexOf(machine), 1);
              } else {
                this.alertType = "danger";
                this.alertMessage = "Problemas ao excluir a Máquina!";
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
      this.machine_selected = null;
      this.showForm = true;
    },
    reloadDataTable(value) {
      if (value || value === undefined) {
        const token = localStorage.getItem("token");
        var Options = {
          method: "get",
          url: "/api/machine/",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        axios(Options).then((response) => {
          this.machines = response.data;
        });
      } else if (value === false) {
        this.alertType = "warning";
        this.alertMessage = "Problemas ao inserir/atualizar o registro maquina";
        this.dismissCountDown = this.dismissSecs;
      }

      if (value) {
        this.alertType = "success";
        this.alertMessage = `Máquina inserido/editado com sucesso.`;
        this.dismissCountDown = this.dismissSecs;
      }
    },
  },
  computed: {
    ...mapGetters(["permissions"]),
    loadingTableResult() {
      return this.machines == null;
    },
  },
};
</script>

<style></style>
