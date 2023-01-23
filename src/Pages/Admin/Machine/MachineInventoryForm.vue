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
        <div class="row" style="margin-bottom:10px" v-if="user.role.level < 3">
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
          <template #cell(pivot.price)="obj">
            {{ obj.item.pivot.price | currency }}
          </template>

          <template #cell(pivot.cost)="obj">
            {{ obj.item.pivot.cost | currency }}
          </template>

          <template #cell(action)="obj">
            <div class="row">
              <div class="col btn">
                <font-awesome-icon
                  icon="plus-circle"
                  size="2x"
                  class="text-success"
                  @click="onIncrease(obj.item)"
                />
              </div>
              <div class="col btn" v-if="obj.item.pivot.quantity > 0">
                <font-awesome-icon
                  icon="minus-circle"
                  size="2x"
                  class="text-danger"
                  @click="onDecrease(obj.item)"
                />
              </div>
              <div class="col btn" v-else>
                <font-awesome-icon
                  icon="minus-circle"
                  size="2x"
                  class="buttonDisabled"
                />
              </div>
              <div class="col btn">
                <font-awesome-icon
                  icon="edit"
                  size="2x"
                  class="text-info"
                  @click="onEdit(obj.item)"
                  v-if="user.role.level < 3"
                />
              </div>
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

    <b-modal id="editItemModal" title="Editar Item">
      <div class="row" v-if="selectedItem">
        <div class="col-md-6">
          <div class="position-relative form-group">
            <label for="labelFormCode" class="">Cogido da mensagem</label
            ><input
              name="code"
              id="formCode"
              placeholder="Codigo do Item na mensagem"
              type="text"
              class="form-control"
              v-model="selectedItem.pivot.code"
            />
          </div>
        </div>
        <div class="col-md-6">
          <div class="position-relative form-group">
            <label for="labelFormPrice" class="">Preço</label>
            <money
              class="form-control"
              v-model="selectedItem.pivot.price"
              v-bind="money"
            ></money>
          </div>
        </div>
        <div class="col-md-6">
          <div class="position-relative form-group">
            <label for="labelFormPrice" class="">Custo</label>
            <money
              class="form-control"
              v-model="selectedItem.pivot.cost"
              v-bind="money"
            ></money>
          </div>
        </div>
        <div class="col-md-12" v-if="editMsg">
          <b-alert variant="warning" show>{{ editMsg }}</b-alert>
        </div>
      </div>

      <template #modal-footer>
        <div class="w-100">
          <b-button-group>
            <button class="btn btn-primary" @click.stop="onUpdate()">
              Salvar
            </button>
            <button class="btn btn-danger" @click.stop="onCancelUpdate()">
              Cancelar
            </button>
          </b-button-group>
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
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
library.add(faPlusCircle, faMinusCircle, faRecycle, faEdit);
import { mapGetters } from "vuex";
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
        { key: "pivot.code", label: "codigo" },
        { key: "pivot.price", label: "preço" },
        { key: "pivot.cost", label: "custo" },
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

      selectedItem: null,
      originalItem: null,

      availableItems: [],

      money: {
        decimal: ",",
        thousands: ".",
        prefix: "R$ ",
        precision: 2,
        masked: false,
      },

      editMsg: null,
    };
  },
  computed: {
    loadingTableResult() {
      return this.machine == null;
    },
    ...mapGetters(["user"]),
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
    onEdit(item) {
      this.selectedItem = item;
      this.originalItem = Object.assign({}, item.pivot);
      this.editMsg = null;
      this.$bvModal.show("editItemModal");
    },
    onUpdate() {
      if (
        this.selectedItem.pivot.code == "C0" ||
        this.selectedItem.pivot.code == "C1"
      ) {
        this.editMsg =
          "O valor C0 ou C1, são valores reservados e não podem ser utilizados no código";
        this.selectedItem.pivot.code = this.originalItem.code;
        this.selectedItem.pivot.price = this.originalItem.price;
        return false;
      }

      var Options = {
        method: "POST",
        url: `/api/inventory/item`,
        data: {
          item: this.selectedItem,
        },
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      };
      axios(Options)
        .then(() => {
          this.$bvModal.hide("editItemModal");
        })
        .catch((msg) => {
          this.alertMessage = msg.response.data;
          this.dismissCountDown = this.dismissSecs;
        });
    },
    onCancelUpdate() {
      this.selectedItem.pivot.code = this.originalItem.code;
      this.selectedItem.pivot.price = this.originalItem.price;
      this.$bvModal.hide("editItemModal");
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
  filters: {
    currency(value) {
      if (typeof value !== "number") {
        return value;
      }
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

<style lang="scss" scoped>
.modal-body {
  height: 100px;
  overflow: scroll;
  background-color: red;
}
.buttonDisabled {
  color: gray;
}
.buttonMinusCircle {
  color: red;
}
</style>
