<template>
  <div class="content row mb-3">
    <b-col xs-12>
      <b-card>
        <div class="row mb-1">
          <div class="col-xs-12 col-sm-4 col-lg-4 mb-1">
            <h5 class="card-title">
              <font-awesome-icon
                icon="database"
                size="1x"
                class="text-info"
              />&nbsp;Maquinas
            </h5>
          </div>
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
        <div v-if="machines">
          <b-list-group
            v-for="machine in machines.data"
            :key="machine.id"
            @click="detailMachine(machine)"
            v-b-modal.transactionModal
          >
            <b-list-group-item>
              <div class="row">
                <div class="col-12">
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
                <div class="col-xs-6 col-sm-6 col-lg-2">
                  <b-badge class="label">Saldo</b-badge><br />
                  <span class="machine-content">{{
                    machine.balance | currency
                  }}</span>
                </div>
                <div class="col-xs-6 col-sm-6 col-lg-2">
                  <b-badge
                    class="label"
                    :class="{ 'bg-danger': inventario(machine) <= 0 }"
                    >Inventário</b-badge
                  ><br />
                  <span class="machine-content">{{ inventario(machine) }}</span>
                </div>
                <div class="col-xs-6 col-sm-6 col-lg-2">
                  <b-badge class="label">Custo atual</b-badge><br />
                  <span class="machine-content">{{
                    totalCostList(machine) | currency
                  }}</span>
                </div>
                <div class="col-xs-6 col-sm-6 col-lg-2">
                  <b-badge class="label">Aposta</b-badge><br />
                  <span class="machine-content">{{
                    machine.bet | currency
                  }}</span>
                </div>
                <div
                  class="col-xs-6 col-sm-6 col-lg-2"
                  v-if="machine.last_message"
                >
                  <b-badge class="label">Ultima com.</b-badge><br />
                  <span class="machine-content">{{
                    machine.last_message.created_at | friendlyDate
                  }}</span>
                </div>
                <div
                  class="col-xs-6 col-sm-6 col-lg-2"
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
        <div v-else>
          <div class="text-center text-danger my-2">
            <b-spinner class="align-middle"></b-spinner>
            <strong>Carregando...</strong>
          </div>
        </div>
      </b-card>
    </b-col>

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
import { mapGetters } from "vuex";
import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faDatabase,
  faHandHoldingUsd,
} from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
library.add(faDatabase, faHandHoldingUsd);

import Transaction from "../../Manager/Machine/Transaction.vue";

import helper from "../../../assets/helper";

export default {
  name: "MachineList",
  components: {
    "font-awesome-icon": FontAwesomeIcon,
    Transaction,
  },
  data() {
    return {
      token: null,
      machines: null,
      data: {
        order: "name",
        only: null,
        perPage: 3,
      },
      selected: 3,
      options: [
        { value: 3, text: 3 },
        { value: 5, text: 5 },
        { value: 10, text: 10 },
        { value: 20, text: 20 },
        { value: 50, text: 50 },
      ],
      selectedOrder: "serial",
      optionsOrder: [
        { value: "serial", text: "Serial" },
        { value: "name", text: "Nome" },
      ],
      selectedStatus: "all",
      optionsStatus: [
        { value: "all", text: "Todas" },
        { value: "online", text: "Online" },
        { value: "offline", text: "Offline" },
      ],

      machine_selected: null,
    };
  },
  methods: {
    loadMachines(currentPage) {
      this.machines = null;
      var Options = {
        method: "post",
        data: this.data,
        url: `/api/machine/paginate/${this.selected}?page=${currentPage}&orderby=${this.selectedOrder}&status=${this.selectedStatus}`,
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      };
      axios(Options).then((response) => {
        this.machines = response.data;
      });
    },
    updatePage(value) {
      this.loadMachines(value);
    },
    inventario(machine) {
      let totalInventory = machine.inventory.items.reduce(function(prev, next) {
        return prev + next.pivot.quantity;
      }, 0);
      return totalInventory;
    },
    detailMachine(machine) {
      this.machine_selected = machine;
    },

    totalCostList(machine) {
      return helper.getMachineCost(machine);
    },
  },
  created() {
    this.token = localStorage.getItem("token");
    this.loadMachines(1);
  },
  computed: {
    ...mapGetters(["user", "permissions"]),
  },
  watch: {
    selected(next, prev) {
      if (next !== prev) this.loadMachines(1);
    },
    selectedOrder(next, prev) {
      if (this.machines == null) return false;
      if (next !== prev) this.loadMachines(this.machines.current_page);
    },
    selectedStatus(next, prev) {
      if (this.machines == null) return false;
      if (next !== prev) this.loadMachines(this.machines.current_page);
    },
  },
  filters: {
    currency(value) {
      var formatter = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
      });
      return formatter.format(value);
    },
    friendlyDate: (date) => {
      let novaData = new Date(date);
      return novaData.toLocaleString("pt-BR");
    },
  },
};
</script>

<style scoped sass>
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
