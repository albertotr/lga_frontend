<template>
  <div>
    <div class="content">
      <div class="row">
        <div class="col-md-12">
          <div class="main-card mb-3 card">
            <div class="card-body">
              <h5 class="card-title">
                <font-awesome-icon
                  icon="recycle"
                  size="1x"
                  class="text-info"
                />&nbsp;Ultimas transações
              </h5>
              <b-form-group
                v-slot="{ ariaDescribedby }"
                class="col-xs-12 col-sm-6 col-lg-3"
              >
                <b-form-select
                  id="radio-group-1"
                  v-model="selected"
                  :options="options"
                  :aria-describedby="ariaDescribedby"
                  name="radio-options"
                  v-if="contributors && contributors.length > 1"
                  buttons
                  stacked
                  size="sm"
                ></b-form-select>
              </b-form-group>
              <div
                class="vertical-time-simple vertical-without-time vertical-timeline vertical-timeline--animate vertical-timeline--one-column"
                v-if="transactions"
              >
                <div
                  class="vertical-timeline-element"
                  v-for="transaction in transactions.slice().reverse()"
                  :key="transaction.id"
                >
                  <div>
                    <span
                      class="vertical-timeline-element-icon bounce-in"
                    ></span>
                    <div class="vertical-timeline-element-content bounce-in">
                      <div class="row">
                        <div class="col-12">
                          {{ transaction.created_at | friendlyDate }}
                        </div>
                        <div class="col-xs-12 col-sm-6 col-lg-3">
                          <strong>Operador:</strong> {{ transaction.user.name }}
                        </div>
                        <div class="col-xs-12 col-sm-6 col-lg-3">
                          <strong>Machina:</strong
                          >{{ transaction.machine.name }} | {{ transaction.machine.serial }}
                        </div>
                        <div class="col-xs-12 col-sm-6 col-lg-3">
                          <strong>Valor do Saque:</strong>
                          {{ transaction.balance | currency }} / {{ transaction.amount | currency }}
                        </div>
                        <div class="col-xs-12 col-sm-6 col-lg-3">
                          <strong>Inventario:</strong>
                          {{ inventoryText(transaction.inventory) }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else>
                <div class="text-center text-danger my-2">
                  <b-spinner class="align-middle"></b-spinner>
                  <strong>Carregando...</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faRecycle } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
library.add(faRecycle);

export default {
  name: "TransactionsList",
  components: {
    "font-awesome-icon": FontAwesomeIcon,
  },
  data() {
    return {
      transactions: null,
      token: null,
      selected: "all",
      contributors: null,
      operatorIdTransaction: null,
    };
  },
  methods: {
    loadTransactionHistory() {
      let operatorId =
        this.operatorIdTransaction == null ? "" : this.operatorIdTransaction;
      var Options = {
        method: "get",
        url: `/api/transaction/history/${operatorId}`,
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      };
      axios(Options).then((response) => {
        this.transactions = response.data;
        this.transactions = this.transactions.map((transaction)=>{
          transaction.inventory = JSON.parse(transaction.inventory);
          return transaction;
        });
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
    inventoryText(inventory){
      let text = inventory.reduce( (description, value) => {
        return `${description} ${value.name}:${value.pivot.quantity};`;
      },'')
      return text;
    }
  },
  created() {
    this.token = localStorage.getItem("token");
    this.loadTransactionHistory();
    this.loadContributors();
    this.selected = this.user.id;
    this.operatorIdTransaction = this.user.id;
  },
  computed: {
    ...mapGetters(["user", "permissions"]),
    options() {
      let optionList = this.contributors.map((contributor) => {
        return { text: contributor.name, value: contributor.user_id };
      });

      return [{ text: "Todos operadores", value: this.user.id }, ...optionList];
    },
  },
  watch: {
    selected(operatorId) {
      this.transactions = null;
      this.operatorIdTransaction = operatorId;
      this.loadTransactionHistory();
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

<style scoped></style>
