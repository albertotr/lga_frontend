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
    ></page-title>
    <div class="content">
      <div class="row">
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
        hover
        :busy="loadingTableResult"
        responsive="sm"
      >
        <template #cell(machine)="obj">
          {{ obj.item.serial }}
        </template>

        <template #cell(balance)="obj">
          {{ obj.item.balance | currency }}
        </template>

        <template #cell(total_balance)="obj">
          {{ obj.item.total_balance | currency }}
        </template>

        <template #cell(cost)="obj">
          {{ obj.item.cost | currency }}
        </template>

        <template #cell(total_inventory)="obj">
          {{ calculateTotalInventory(obj.item.inventory.items) }}
        </template>

        <template #cell(action)="obj">
          <router-link
            class="btn btn-info btn-sm"
            :to="{
              name: 'managemachinemessages',
              params: { machine: obj.item },
            }"
          >
            <font-awesome-icon style="color:white" icon="list-alt" size="1x" class="btn-width" /> </router-link
          >&nbsp;&nbsp;&nbsp;

          <button class="btn btn-info btn-sm" v-b-modal.transactionModal @click="onTransaction(obj.item)" :disabled="!obj.item.device" v-if="permissions.includes('view-machine')">
            <font-awesome-icon style="color:white"
              icon="dollar-sign"
              size="1x" 
              class="btn-width"             
            /> </button
          >&nbsp;&nbsp;&nbsp;

          <router-link
            class="btn btn-info btn-sm"
            :to="{
              name: 'managemachinetransactions',
              params: { machine: obj.item },
            }"
            v-if="permissions.includes('view-machine')"
          >
            <font-awesome-icon style="color:white" icon="clipboard-list" size="1x" class="btn-width" />
          </router-link>&nbsp;&nbsp;&nbsp;

          <router-link
            class="btn btn-info btn-sm"
            :to="{
              name: 'managemachineedit',
              params: { machine: obj.item.id },
            }"
            v-if="permissions.includes('update-machine')"
          >
            <font-awesome-icon style="color:white" icon="pencil-alt" size="1x" class="btn-width" />
          </router-link> 
        </template>

        <template #table-busy>
          <div class="text-center text-danger my-2">
            <b-spinner class="align-middle"></b-spinner>
            <strong>Carregando...</strong>
          </div>
        </template>
      </b-table>
    </div>

    <b-modal
      id="transactionModal"
      v-if="machine_selected"
      :title="`Transação Maquina ${machine_selected.serial}`"
      hide-footer
    >
      <transaction :machine="machine_selected"/>
    </b-modal>
    
  </div>
</template>

<script>
import PageTitle from "../../../Layout/Components/PageTitle.vue";
import { mapGetters } from "vuex";
import axios from "axios";
import Transaction from "./Transaction.vue";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faEdit,
  faTrash,
  faListAlt,
  faDollarSign,
  faClipboardList,
  faPencilAlt,
} from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";

library.add(faEdit, faTrash, faListAlt, faDollarSign, faClipboardList, faPencilAlt);

export default {
  name: "ManageMachines",
  components: {
    PageTitle,
    "font-awesome-icon": FontAwesomeIcon,
    Transaction,
  },
  data() {
    return {
      token: null,
      heading: "Gerenciamento de Máquinas",
      subheading: "Verifique os dados antes de executar as ações.",
      icon: "pe-7s-server text-warning",
      machines: null,
      machine_selected: null,
      fields: [
        { key: "name", label: "Maquina" },
        { key: "machine", label: "Serial" },
        { key: "balance", label: "Saldo" },
        { key: "total_balance", label: "Saldo Bruto" },
        { key: "cost", label: "Custo" },
        { key: "total_inventory", label: "Inventário" },
        { key: "action", label: "Ações" },
      ],
      dismissSecs: 10,
      dismissCountDown: 0,
      alertType: "success",
      alertMessage: "",
      lastreload: null,

    };
  },
  created() {
    this.reloadDataTable();
    this.token = localStorage.getItem("token");
  },
  methods: {
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown;
    },
    onShowMessage(machine) {
      this.machine_selected = machine;
    },
    reloadDataTable() {
      this.lastreload = null;
      var Options = {
        method: "get",
        url: "/api/machine/",
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      };
      axios(Options).then((response) => {
        let localDate = new Date();
        this.lastreload =
          localDate.toLocaleDateString("pt-BR") +
          " " +
          localDate.toLocaleTimeString("pt-BR");
        this.machines = response.data;
      });
    },
    onTransaction(machine) {
      this.machine_selected = machine;
    },
    
    calculateTotalInventory(inventory) {
      return inventory.reduce(
        (partial_sum, item) => partial_sum + item.pivot.quantity,
        0
      );
    },
  },
  computed: {
    ...mapGetters(["permissions"]),
    loadingTableResult() {
      return this.machines == null;
    },
    totalInventory() {
      return this.machine_selected.inventory.items.reduce(
        (partial_sum, item) => partial_sum + item.pivot.quantity,
        0
      );
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

<style scoped>
.btn-width{
  width:20px;
}
</style>
