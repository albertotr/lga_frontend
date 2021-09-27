<template>
  <div class="content">
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
    <div class="main-card mb-3 card">
      <div class="card-body">
        <h5 class="card-title">
          Inventario
        </h5>
        <div class="row" style="margin-bottom:10px">
          <div class="col">
            <b-button
              squared
              variant="primary"
              @click="$bvModal.show('addItemModal')"
              ><font-awesome-icon icon="plus-circle" size="1x" /> Adicionar Item
              não listado</b-button
            >
          </div>
        </div>
        <b-table
          :items="machine.inventory.items"
          :fields="fields"
          striped
          bordered
          hover
          :busy="loadingTableResult"
          responsive="sm"
        >
          <template #cell(action)="obj">
            <div class="row">
              <font-awesome-icon
                icon="plus-circle"
                size="2x"
                class="col text-info"
                @click="onIncrease(obj.item)"
              />
              <font-awesome-icon
                icon="minus-circle"
                size="2x"
                class="col text-info"
                @click="onDecrease(obj.item)"
                v-if="obj.item.pivot.quantity > 0"
              />
              <font-awesome-icon
                icon="minus-circle"
                size="2x"
                class="col text-light"
                v-else
              />
            </div>
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

    <b-modal id="exchangeModal" :title="action" hide-footer>
      <p class="">
        <label for="labelFormQtd" class="">Quantidade</label
        ><input
          name="qtd"
          id="formQtd"
          placeholder="0"
          type="number"
          class="form-control"
          step="1"
          min="0"
          :max="actionMaxValue"
          v-model="actionValue"
        />
      </p>

      <div class="row">
        <div class="col">
          <b-button variant="primary" class="mt-3" block @click="onExchange()"
            >Salvar</b-button
          >
        </div>
        <div class="col">
          <b-button class="mt-3" block @click="$bvModal.hide('exchangeModal')"
            >Cancelar</b-button
          >
        </div>
      </div>
    </b-modal>

    <b-modal id="addItemModal" title="Adicionar novo Item">
      <b-list-group>
        <b-list-group-item
          href="#"
          class="flex-column align-items-start"
          v-for="(availableItem, idx) in availableItems"
          :key="idx"
          @click="onAddItem(availableItem)"
        >
          <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">{{ availableItem.name }}</h5>
            <small>Preço R${{ availableItem.price }}</small>
          </div>

          <p class="mb-1">
            {{ availableItem.description }}
          </p>
        </b-list-group-item>
      </b-list-group>

      <template #modal-footer>
        <div class="w-100">
          <b-button
            variant="danger"
            size="sm"
            class="float-right"
            @click="$bvModal.hide('addItemModal')"
          >
            Cancelar
          </b-button>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script>
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faPlusCircle,
  faMinusCircle,
  faRecycle,
} from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
library.add(faPlusCircle, faMinusCircle, faRecycle);
export default {
  name: "MachineInventory",
  components: { FontAwesomeIcon },
  props: {
    machine: Object,
  },
  data() {
    return {
      fields: [
        { key: "name", label: "Nome" },
        { key: "pivot.quantity", label: "estoque" },
        { key: "action", label: "Ações" },
      ],
      action: null,
      actionItem: null,
      actionValue: 0,
      actionMaxValue: 1000,
      multiplier: 1,
      token: localStorage.getItem("token"),

      dismissSecs: 10,
      dismissCountDown: 0,
      alertType: "warning",
      alertMessage: "",

      availableItems: [],
    };
  },
  computed: {
    loadingTableResult() {
      return this.machine == null;
    },
  },
  methods: {
    onIncrease(item) {
      this.multiplier = 1;
      this.actionValue = 0;
      this.actionItem = item;
      this.action = `Adicionar ${item.name}`;
      this.actionMaxValue = 1000;
      this.$bvModal.show("exchangeModal");
    },
    onDecrease(item) {
      this.multiplier = -1;
      this.actionValue = 0;
      this.actionItem = item;
      this.action = `Retirar ${item.name}`;
      this.actionMaxValue = item.pivot.quantity;
      this.$bvModal.show("exchangeModal");
    },
    onExchange() {
      this.actionValue = this.actionValue * this.multiplier;
      let newQuantity = this.actionValue + this.actionItem.pivot.quantity;

      if (newQuantity < 0) {
        this.alertMessage =
          "Você tentou retirar mais itens que existe em estoque.";
        this.dismissCountDown = this.dismissSecs;
        this.$bvModal.hide("exchangeModal");
        return false;
      }

      var Options = {
        method: "POST",
        url: `/api/inventory/${this.actionItem.pivot.inventory_id}`,
        data: {
          item: this.actionItem.id,
          from: null,
          amount: this.actionValue,
          quantity: newQuantity,
        },
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      };
      axios(Options)
        .then(() => {
          this.actionItem.pivot.quantity = newQuantity;
        })
        .catch((msg) => {
          this.alertMessage = msg.response.data;
          this.dismissCountDown = this.dismissSecs;
        });

      this.$bvModal.hide("exchangeModal");
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown;
    },

    onAddItem(newItem) {
      var Options = {
        method: "POST",
        data: newItem,
        url: `/api/inventory/additem/${this.machine.inventory.id}`,
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      };
      axios(Options)
        .then((result) => {
          this.machine.inventory = result.data;
          this.loadAvaliableItems();
          this.$bvModal.hide("addItemModal");
        })
        .catch((msg) => {
          this.alertMessage = msg.response.data;
          this.dismissCountDown = this.dismissSecs;
        });
    },

    loadAvaliableItems() {
      var Options = {
        method: "GET",
        url: `/api/item/${this.machine.inventory.id}`,
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      };
      axios(Options)
        .then((result) => {
          this.availableItems = result.data;
        })
        .catch((msg) => {
          this.alertMessage = msg.response.data;
          this.dismissCountDown = this.dismissSecs;
        });
    },
  },
  created() {
    this.loadAvaliableItems();
  },
};
</script>

<style scoped>
.modal-body {
  height: 100px;
  overflow: scroll;
  background-color: red;
}
</style>
