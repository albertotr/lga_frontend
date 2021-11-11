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
            <font-awesome-icon style="color:white" icon="list-alt" size="1x" /> </router-link
          >&nbsp;&nbsp;&nbsp;

          <button class="btn btn-info btn-sm" @click="onTransaction(obj.item)" :disabled="!obj.item.device" v-if="permissions.includes('view-machine')">
            <font-awesome-icon style="color:white"
              icon="dollar-sign"
              size="1x"              
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
            <font-awesome-icon style="color:white" icon="clipboard-list" size="1x" />
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
    >
      <div class="row">
        <b-col sm="6">
          <label class="">Maquina:&nbsp;</label
          ><span>{{ this.machine_selected.serial }}</span>
        </b-col>
        <b-col sm="6">
          <label class="">MAC:&nbsp;</label
          ><span>{{ this.machine_selected.device.mac }}</span>
        </b-col>

        <b-col sm="4">
          <label class="">Saldo Bruto:&nbsp;</label
          ><span>{{ this.machine_selected.total_balance | currency }}</span>
        </b-col>
        <b-col sm="4">
          <label class="">Saldo:&nbsp;</label
          ><span>{{ this.machine_selected.balance | currency }}</span>
        </b-col>
        <b-col sm="4">
          <label class="">Custo:&nbsp;</label
          ><span>{{ this.machine_selected.cost | currency }}</span>
        </b-col>

        <b-col sm="12">
          <b-row>
            <b-col>
              <label class="">Estoque esperado:&nbsp;</label
              ><span>{{ this.totalInventory }}</span>
            </b-col>
            <b-col
              ><button
                class="btn btn-sm btn-primary"
                @click.stop="onEditInventory()"
              >
                Editar Estoque
              </button></b-col
            >
          </b-row>
        </b-col>

        <b-col sm="12">
          <br />
          <div class="position-relative form-group">
            <label for="labelFormMoney" class="">Valor do saque</label>
            <money
              class="form-control"
              v-model="value"
              v-bind="money"
              :class="{ 'is-invalid': invalidValue }"
            ></money>
            <div class="invalid-feedback">
              <ul>
                <li v-for="msg in invalidValueMessage" :key="msg">
                  {{ msg }}
                </li>
              </ul>
            </div>
          </div>
        </b-col>

        <b-col sm="12">
          <div class="position-relative form-group">
            <label for="labelFormCode" class="">Comentario</label
            ><b-form-textarea
              id="textarea"
              v-model="comment"
              placeholder="Comentarios..."
              rows="3"
              max-rows="6"
            ></b-form-textarea>
          </div>
        </b-col>

        <b-col sm="6">
          <b-form-checkbox v-model="match" checked
            >Valores correspondem ao real</b-form-checkbox
          >
        </b-col>

        <b-col sm="6">
          <b-form-checkbox v-model="zeroBalance" checked
            >Zerar saldo</b-form-checkbox
          >
        </b-col>
      </div>

      <template #modal-footer>
        <div class="w-100">
          <b-button-group>
            <button class="btn btn-primary" @click.stop="onTransactionCreate">
              Sacar
            </button>
            <button
              class="btn btn-danger"
              @click.stop="$bvModal.hide('transactionModal')"
            >
              Cancelar
            </button>
          </b-button-group>
        </div>
      </template>
    </b-modal>

    <b-modal
      id="inventoryModal"
      v-if="machine_selected"
      size="xl"
      :title="`Edição Inventario Maquina ${machine_selected.serial}`"
    >
      <machine-inventory :machine="machine_selected" />
    </b-modal>
  </div>
</template>

<script>
import PageTitle from "../../../Layout/Components/PageTitle.vue";
import { mapGetters } from "vuex";
import axios from "axios";
import MachineInventory from "../../Admin/Machine/MachineInventoryForm.vue";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faEdit,
  faTrash,
  faListAlt,
  faDollarSign,
  faClipboardList,
} from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";

library.add(faEdit, faTrash, faListAlt, faDollarSign, faClipboardList);

export default {
  name: "ManageMachines",
  components: {
    PageTitle,
    "font-awesome-icon": FontAwesomeIcon,
    MachineInventory,
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
        { key: "machine", label: "Maquina" },
        {
          key: "device.mac",
          label: "MAC",
          tdClass: "d-sm-none d-md-block",
          thClass: "d-sm-none d-md-block",
        },
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

      value: 0,
      comment: "",
      match: true,
      zeroBalance: true,
      money: {
        decimal: ",",
        thousands: ".",
        prefix: "R$ ",
        precision: 2,
        masked: false,
      },
      invalidValue: false,
      invalidValueMessage: 0,
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
      this.value = machine.balance;
      this.$bvModal.show("transactionModal");
    },
    onEditInventory() {
      this.$bvModal.show("inventoryModal");
    },
    calculateTotalInventory(inventory) {
      return inventory.reduce(
        (partial_sum, item) => partial_sum + item.pivot.quantity,
        0
      );
    },
    onTransactionCreate() {
      const invent = this.calculateTotalInventory(
        this.machine_selected.inventory.items
      );
      var Options = {
        method: "post",
        data: {
          machine: this.machine_selected,
          value: this.value,
          comment: this.comment,
          match: this.match,
          zerobalance: this.zeroBalance,
          inventory: invent,
        },
        url: "/api/transaction/",
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      };
      axios(Options)
        .then(() => {
          let newBalance =
            parseFloat(this.machine_selected.balance) - parseFloat(this.value);

          if (newBalance < 0) newBalance = 0;

          this.machine_selected.balance = this.zeroBalance ? 0 : newBalance;
          this.machine_selected.cost = 0;
          this.$bvModal.hide("transactionModal");
        })
        .catch((msg) => {
          this.alertType = "warning";
          this.alertMessage = msg.response.data;
          this.dismissCountDown = this.dismissSecs;
          this.$bvModal.hide("transactionModal");
        });
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

<style></style>
