<template>
  <div class="content row mb-3">
    <b-col xs-12>
      <b-card>
        <div class="row mb-1">
          <div class="col-xs-12 col-sm-6 mb-1">
            <div class="row">
              <div class="col-12 col-md-6">
                <h5 class="card-title">
                  <font-awesome-icon
                    icon="database"
                    size="1x"
                    class="text-info"
                  />&nbsp;Maquinas
                  <template v-if="status"
                    ><span class="text-info">{{ status.total }}</span
                    >/<span class="text-success">{{ status.online }}</span
                    >/<span class="text-danger">{{ status.offline }}</span></template
                  >
                </h5>
              </div>

              <div class="col">
                <b-form-select
                  id="qtdMachines"
                  v-model="selected"
                  :options="options"
                  size="sm"
                ></b-form-select>
              </div>
              <div class="col">
                <b-form-select
                  id="radio-group-1"
                  v-model="operator_selected"
                  :options="operators"
                  name="radio-options"
                  v-if="contributors && contributors.length > 1"
                  buttons
                  stacked
                  size="sm"
                ></b-form-select>
              </div>
            </div>
          </div>
          <div class="col-xs-3 col-sm-6 mb-1">
            <b-form-radio-group
              id="machineStatus"
              v-model="selectedStatus"
              :options="optionsStatus"
              name="radiosStatus"
              buttons
              :disabled="machines == null"
              style="margin-right:10px;"
            ></b-form-radio-group>

            <b-form-radio-group
              id="orderBy"
              v-model="selectedOrder"
              :options="optionsOrder"
              name="radiosOrderBy"
              buttons
            ></b-form-radio-group>
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

                <div class="col-6 col-lg-2">
                  <b-badge class="label">Entrada</b-badge><br />
                  <span class="machine-content"
                    >{{ machine.balance | currency }}
                    {{ inventario(machine) }}</span
                  >
                </div>
                <div class="col-6 col-lg-2">
                  <b-badge class="label">Saida</b-badge><br />
                  <span class="machine-content">
                    {{ totalCostList(machine) | currency }}
                    {{ getMachineItemOut(machine) }}
                  </span>
                </div>

                <div class="col-xs-6 col-sm-6 col-lg-2">
                  <b-badge class="label">Aposta</b-badge><br />
                  <span class="machine-content">{{
                    machine.bet | currency
                  }}</span>
                </div>
                <div class="col-6 col-lg-2" v-if="machine.last_message">
                  <b-badge class="label">Ultima com.</b-badge><br />
                  <span class="machine-content">{{
                    machine.last_message.created_at | friendlyDate
                  }}</span>
                </div>
                <div class="col-6 col-lg-2">
                  <b-badge class="label">Coleta</b-badge><br />
                  <span
                    class="machine-content"
                    v-if="machine.last_transaction"
                    >{{
                      machine.last_transaction.created_at | friendlyDate
                    }}</span
                  >
                  <span class="machine-content" v-else>sem coleta</span>
                </div>

                <div class="col-12 col-lg-2" v-if="machine.operators">
                  <b-badge class="label">Operador(s)</b-badge><br />
                  <span
                    class="machine-content"
                    v-for="operator in machine.operators"
                    :key="operator.id"
                  >
                    {{ operator.name }};
                  </span>
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
      :title="`Transação Maquina ${machine_selected.name}`"
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
      operator_selected: "all",
      contributors: null,
      status: null,
    };
  },
  methods: {
    loadMachines(currentPage) {
      this.machines = null;
      var Options = {
        method: "post",
        data: this.data,
        url: `/api/machine/paginate/${this.selected}?page=${currentPage}&orderby=${this.selectedOrder}&status=${this.selectedStatus}&operator=${this.operator_selected}`,
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      };
      axios(Options).then((response) => {
        this.machines = response.data;
      });
    },
    loadContributors() {
      var Options = {
        method: "get",
        url: `/api/operator/contributors/${this.user.id}`,
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      };
      axios(Options).then((response) => {
        this.contributors = response.data;
      });
    },
    loadMachinesStatus() {
      var Options = {
        method: "get",
        url: "/api/machine/status",
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      };
      axios(Options).then((response) => {
        this.status = response.data;
      });
    },
    updatePage(value) {
      this.loadMachines(value);
    },
    inventario(machine) {
      let totalInventory = machine.inventory.items.map(function(item) {
        return item.pivot.quantity;
      });
      return totalInventory;
    },
    detailMachine(machine) {
      this.machine_selected = machine;
    },

    totalCostList(machine) {
      return helper.getMachineCost(machine);
    },
    getMachineItemOut(machine) {
      return helper.getMachineItemOut(machine);
    },
  },
  created() {
    this.token = localStorage.getItem("token");
    this.loadMachines(1);
    this.loadContributors();
    this.operator_selected = "all";
    this.loadMachinesStatus();
  },
  computed: {
    ...mapGetters(["user", "permissions"]),
    operators() {
      let optionList = this.contributors.map((contributor) => {
        return { text: contributor.name, value: contributor.user_id };
      });

      return [{ text: "Todos operadores", value: "all" }, ...optionList];
    },
  },
  watch: {
    selected(next, prev) {
      if (next !== prev) {
        this.loadMachines(1);
      }
    },
    selectedOrder(next, prev) {
      if (this.machines == null) return false;
      if (next !== prev) this.loadMachines(this.machines.current_page);
    },

    selectedStatus(next, prev) {
      if (this.machines == null) return false;
      if (next !== prev) {
        this.loadMachines(this.machines.current_page);
      }
    },
    operator_selected(next, prev) {
      if (this.machines == null) return false;
      if (next !== prev) {
        this.loadMachines(this.machines.current_page);
      }
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
  font-size: 0.8em;
  line-height: 0.6em;
  border: 1px solid #999;
  background-color: transparent;
}

.machine-name {
  font-size: medium;
}

.machine-content {
  font-size: small;
}
</style>
