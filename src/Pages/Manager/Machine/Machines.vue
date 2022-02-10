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
          <b-button
            block
            variant="primary"
            @click="reloadDataTable(machines.current_page)"
          >
            <span v-if="lastreload">{{ lastreload }}</span>
            <span v-else>
              <b-spinner small type="grow"></b-spinner> Carregando...
            </span>
          </b-button>
        </div>
      </div>

      <div class="text-center text-danger my-2" v-if="machines == null">
        <b-spinner class="align-middle"></b-spinner>
        <strong>Carregando...</strong>
      </div>

      <div v-else>
        <div class="row">
          <div class="col-xs-3 col-sm-5 col-lg-4 mb-1">
            <b-form-radio-group
              id="machineStatus"
              v-model="selectedStatus"
              :options="optionsStatus"
              name="radiosStatus"
              buttons
              :disabled="machines == null"
            ></b-form-radio-group>
          </div>
          <div class="col-xs-3 col-sm-5 col-lg-2 mb-1">
            <b-form-radio-group
              id="orderBy"
              v-model="selectedOrder"
              :options="optionsOrder"
              name="radiosOrderBy"
              buttons
            ></b-form-radio-group>
          </div>
          <div class="col-xs-3 col-sm-2 col-lg-1 mb-1">
            <b-form-select
              id="qtdMachines"
              v-model="selected"
              :options="options"
            ></b-form-select>
          </div>
        </div>

        <b-list-group v-for="machine in machines.data" :key="machine.id">
          <b-list-group-item>
            <div class="d-md-flex d-sm-inline-flex flex-md-row flex-sm-column justify-content-between align-items-center">
              <div class="p-0">
                <span class="machine-name"
                  ><font-awesome-icon
                    icon="database"
                    size="1x"
                    :class="{
                      'text-success': machine.online,
                      'text-danger': !machine.online,
                    }"
                  />&nbsp;{{ machine.name }}
                  <small style="color:#ced4da">{{
                    machine.location.name
                  }}</small></span
                >
              </div>

              <div class="p-0">
                <router-link
                  class="btn btn-info btn-sm"
                  :to="{
                    name: 'managemachinemessages',
                    params: { machine: machine },
                  }"
                >
                  <font-awesome-icon
                    style="color:white"
                    icon="list-alt"
                    size="1x"
                    class="btn-width"
                  /> </router-link
                >&nbsp;&nbsp;&nbsp;

                <button
                  class="btn btn-info btn-sm"
                  v-b-modal.transactionModal
                  @click="onTransaction(machine)"
                  :disabled="!machine.device"
                  v-if="permissions.includes('view-machine')"
                >
                  <font-awesome-icon
                    style="color:white"
                    icon="dollar-sign"
                    size="1x"
                    class="btn-width"
                  /></button
                >&nbsp;&nbsp;&nbsp;

                <router-link
                  class="btn btn-info btn-sm"
                  :to="{
                    name: 'managemachinetransactions',
                    params: { machine: machine },
                  }"
                  v-if="permissions.includes('view-machine')"
                >
                  <font-awesome-icon
                    style="color:white"
                    icon="clipboard-list"
                    size="1x"
                    class="btn-width"
                  /> </router-link
                >&nbsp;&nbsp;&nbsp;

                <router-link
                  class="btn btn-info btn-sm"
                  :to="{
                    name: 'managemachineedit',
                    params: { machine: machine.id },
                  }"
                  v-if="permissions.includes('update-machine')"
                >
                  <font-awesome-icon
                    style="color:white"
                    icon="pencil-alt"
                    size="1x"
                    class="btn-width"
                  />
                </router-link>
              </div>
            </div>

            <div class="d-md-flex d-sm-inline-flex flex-md-row flex-sm-column justify-content-between align-items-center">
              <div class="p-0">
                <b-badge class="label">Saldo</b-badge><br />
                <span class="machine-content">{{
                  machine.balance | currency
                }}</span>
              </div>
              <div class="p-0">
                <b-badge
                  class="label"
                  :class="{ 'bg-danger': inventario(machine) <= 0 }"
                  >Inventário</b-badge
                ><br />
                <span class="machine-content">{{ inventario(machine) }}</span>
              </div>
              <div class="p-0">
                <b-badge class="label">Custo atual</b-badge><br />
                <span class="machine-content">{{
                  totalCostList(machine) | currency
                }}</span>
              </div>
              <div class="p-0">
                <b-badge class="label">Aposta</b-badge><br />
                <span class="machine-content">{{
                  machine.bet | currency
                }}</span>
              </div>
              <div
                class="p-0"
                v-if="machine.last_message"
              >
                <b-badge class="label">Ultima com.</b-badge><br />
                <span class="machine-content">{{
                  machine.last_message.created_at | friendlyDate
                }}</span>
              </div>
              <div
                class="p-0"
                v-if="machine.last_transaction"
              >
                <b-badge class="label">Coleta</b-badge><br />
                <span class="machine-content">{{
                  machine.last_transaction.created_at | friendlyDate
                }}</span>
              </div>
            </div>
          </b-list-group-item>
        </b-list-group>

        <!-- fields: [
        { key: "name", label: "Maquina" },
        { key: "machine", label: "Serial" },
        { key: "balance", label: "Saldo" },
        { key: "total_balance", label: "Saldo Bruto" },
        { key: "cost", label: "Custo" },
        { key: "total_inventory", label: "Inventário" },
        { key: "action", label: "Ações" },
      ], -->

        <b-pagination
          size="md"
          :total-rows="machines.total"
          v-model="machines.current_page"
          :per-page="machines.per_page"
          align="center"
          @change="updatePage"
        >
        </b-pagination>
      </div>
    </div>

    <b-modal
      id="transactionModal"
      v-if="machine_selected"
      :title="`Transação Maquina ${machine_selected.serial}`"
      hide-footer
    >
      <transaction :machine="machine_selected" />
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
  faDatabase,
  faHandHoldingUsd,
  faEdit,
  faTrash,
  faListAlt,
  faDollarSign,
  faClipboardList,
  faPencilAlt,
} from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
library.add(
  faDatabase,
  faHandHoldingUsd,
  faEdit,
  faTrash,
  faListAlt,
  faDollarSign,
  faClipboardList,
  faPencilAlt
);

import helper from "../../../assets/helper";

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

      dismissSecs: 10,
      dismissCountDown: 0,
      alertType: "success",
      alertMessage: "",
      lastreload: null,

      machine_selected: null,

      selected: 3,
      selectedOrder: "serial",
      selectedStatus: "all",
      data: {
        order: "name",
        only: null,
        perPage: 3,
      },
      optionsStatus: [
        { value: "all", text: "Todas" },
        { value: "online", text: "Online" },
        { value: "offline", text: "Offline" },
      ],
      options: [
        { value: 3, text: 3 },
        { value: 5, text: 5 },
        { value: 10, text: 10 },
        { value: 20, text: 20 },
        { value: 50, text: 50 },
      ],
      optionsOrder: [
        { value: "serial", text: "Serial" },
        { value: "name", text: "Nome" },
      ],
    };
  },
  created() {
    this.reloadDataTable(1);
    this.token = localStorage.getItem("token");
  },
  methods: {
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown;
    },
    updatePage(value) {
      this.reloadDataTable(value);
    },
    reloadDataTable(currentPage) {
      this.lastreload = null;
      var Options = {
        method: "post",
        url: `/api/machine/paginate/${this.selected}?page=${currentPage}&orderby=${this.selectedOrder}&status=${this.selectedStatus}`,
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
    totalCost(machine) {
      return helper.getMachineCost(machine);
    },
    inventario(machine) {
      let totalInventory = machine.inventory.items.reduce(function(prev, next) {
        return prev + next.pivot.quantity;
      }, 0);
      return totalInventory;
    },
    totalCostList(machine) {
      return helper.getMachineCost(machine);
    },
  },
  computed: {
    ...mapGetters(["permissions"]),
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
    friendlyDate: (date) => {
      let novaData = new Date(date);
      return novaData.toLocaleString("pt-BR");
    },
  },
  watch: {
    selected(next, prev) {
      if (next !== prev) this.reloadDataTable(1);
    },
    selectedOrder(next, prev) {
      if (this.machines == null) return false;
      if (next !== prev) this.reloadDataTable(this.machines.current_page);
    },
    selectedStatus(next, prev) {
      if (this.machines == null) return false;
      if (next !== prev) this.reloadDataTable(this.machines.current_page);
    },
  },
};
</script>

<style scoped>
.btn-width {
  width: 20px;
}
.title {
  padding: 0.75rem 1.25rem;
}
.label {
  color: white;
  font-size: 0.5em;
  background-color: #ced4da;
  line-height: 0.6em;
}
.machine-name {
  font-size: medium;
}

.machine-content {
  font-size: small;
}
</style>
