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

      <div class="row" v-show="!showForm">
        <div class="col">
          <b-button block variant="primary" @click="reloadDataTable">
            <span v-if="lastreload">{{ lastreload }}</span>
            <span v-else>
              <b-spinner small type="grow"></b-spinner> Carregando...
            </span>
          </b-button>
        </div>
      </div>

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
        <template #cell(machine)="obj">
          {{ obj.item.serial }}
        </template>

        <template #cell(inventory)="obj">
          <div class="row">
            <div
              class="col"
              v-for="inventoryItem in obj.item.inventory.items"
              :key="inventoryItem.id"
            >
              {{ inventoryItem.name }}:{{ inventoryItem.pivot.quantity }}
            </div>
          </div>
        </template>

        <template #cell(balance)="obj">
          {{ obj.item.balance | currency }}
        </template>

        <template #cell(total_balance)="obj">
          {{ obj.item.total_balance | currency }}
        </template>

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
        { key: "machine", label: "Maquina" },
        {
          key: "device.mac",
          label: "MAC",
          thClass: "d-none d-sm-block",
          tdClass: "d-none d-sm-block",
        },
        { key: "inventory", label: "Inventário" },
        { key: "balance", label: "Saldo" },
        { key: "total_balance", label: "Saldo Bruto" },
        { key: "action", label: "Ações" },
      ],
      showForm: false,
      dismissSecs: 10,
      dismissCountDown: 0,
      alertType: "success",
      alertMessage: "",
      lastreload: null,
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
      this.lastreload = null;
      const token = localStorage.getItem("token");
      var Options = {
        method: "get",
        url: "/api/machine/",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      axios(Options).then((response) => {
        let localDate = new Date();
        this.lastreload  = localDate.toLocaleDateString('pt-BR')+" "+localDate.toLocaleTimeString('pt-BR');
        this.machines = response.data;
      });
    },
    onListMessage(machine) {
      const token = localStorage.getItem("token");
      var Options = {
        method: "get",
        url: `/api/machine/messages/${machine.id}/10`,
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
  filters: {
    currency(value) {
      var formatter = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 0,
      });
      return formatter.format(value);
    },
  },
};
</script>

<style></style>
