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
      :showForm.sync="showForm"
    ></page-title>
    <div class="content">

     <messages
        :machine="machine_selected"
        :messages="machine_messages"
        v-if="showForm"
      ></messages>

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
            icon="list-alt"
            size="1x"
            class="text-info"
            @click="onListMessage(obj.item)"
            v-if="permissions.includes('view-machine')"
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
import PageTitle from "../../../Layout/Components/PageTitle.vue";
import { mapGetters } from "vuex";
import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faEdit, faTrash, faListAlt } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";

import Messages from "./Messages.vue";

library.add(faEdit, faTrash, faListAlt);

export default {
  name: "ManageMachines",
  components: {
    PageTitle,
    Messages,
    "font-awesome-icon": FontAwesomeIcon,
  },
  data() {
    return {
      heading: "Gerenciamento de Máquinas",
      subheading: "Verifique os dados antes de executar as ações.",
      icon: "pe-7s-server text-warning",
      machines: null,
      machine_selected: null,
      machine_messages: null,
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
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown;
    },
    onShowMessage(machine) {
      this.machine_selected = machine;
      this.showForm = true;
    },
    reloadDataTable() {
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
    },
    onListMessage(machine) {
      const token = localStorage.getItem("token");
      var Options = {
        method: "get",
        url: `/api/machine/messages/${machine.id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      axios(Options).then((response) => {
        this.machine_messages = response.data;
        this.onShowMessage(machine);
      });
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
