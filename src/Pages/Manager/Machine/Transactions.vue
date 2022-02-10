<template>
  <div class="content">
    <page-title
      :heading="heading"
      :subheading="subheading"
      :icon="icon"
      :showForm.sync="showForm"
    ></page-title>
    <div class="main-card mb-3 card">
      <div class="card-body" v-if="transactions">
        <h5>Transações da Maquina</h5>
        <div class="row text-white bg-gradient-dark">
          <div class="col-6">
            <strong>Dispositivo:</strong
            ><template v-if="machine.device"
              >{{ machine.device.mac }} | {{ machine.serial }}</template
            >
          </div>
          <div class="col-3"><strong>Tipo:</strong> {{ machine.type.name }}</div>
          <div class="col-3">
            <strong>Modelo:</strong> {{ machine.sample.name }} |
            {{ machine.sample.slot }} Slots
          </div>
          
        </div>
        <div v-if="transactions">
          
            <div class="list-group">
              <div
                class="list-group-item list-group-item-action"
                v-for="transaction in transactions.data"
                :key="transaction.id"
              >
                <div class="d-flex justify-content-between">
                  <span
                    >Executado por:
                    <strong>{{ transaction.user.name }}</strong></span
                  >
                  <small>{{ transaction.created_at | friendlyDate }}</small>
                </div>
                <div class="row">
                  <div class="col-4">
                    <b-form-group label="Saldo Total">
                      <b-form-input
                        :value="transaction.total_balance | currency"
                        disabled
                      ></b-form-input>
                    </b-form-group>
                  </div>

                  <div class="col-4">
                    <b-form-group label="Saldo Atual">
                      <b-form-input
                        :value="transaction.balance | currency"
                        disabled
                      ></b-form-input>
                    </b-form-group>
                  </div>

                  <div class="col-4">
                    <b-form-group label="Custo">
                      <b-form-input
                        :value="transaction.cost | currency"
                        disabled
                      ></b-form-input>
                    </b-form-group>
                  </div>
                </div>
                <div class="row">
                  <div class="col-4">
                    <b-form-group label="Montante Sacado">
                      <b-form-input
                        :value="transaction.amount | currency"
                        disabled
                      ></b-form-input>
                    </b-form-group>
                  </div>

                  <div class="col-4">
                    <b-form-group label="Itens em inventário">
                      <b-form-input
                        :value="inventoryText(transaction.inventory)"
                        disabled
                      ></b-form-input>
                    </b-form-group>
                  </div>
                </div>
                <small>{{ transaction.comments }}</small>
              </div>
            </div>
          <b-row>
            <b-col md="12" v-if="transactions.last_page > 1">
              <b-pagination
                size="md"
                :total-rows="transactions.total"
                v-model="transactions.current_page"
                :per-page="transactions.per_page"
                align="center"
                @change="updatePage"
              >
              </b-pagination>
            </b-col>
          </b-row>
        </div>
        <div class="row" v-else>
          <ul class="list-group list-group-flush" style="width:100%">
            <li class="list-group-item">Sem mensagens recebidas</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PageTitle from "../../../Layout/Components/PageTitle.vue";
import axios from "axios";
export default {
  name: "Machine_Transactions",
  data() {
    return {
      machine: null,
      transactions: null,

      token: null,
      heading: "Transações da Máquinas",
      subheading: "Verifique os dados antes de executar as ações.",
      icon: "pe-7s-server text-warning",

      perPage: 5,
      showForm: true,
    };
  },
  components: {
    PageTitle,
  },
  methods: {
    loadTransactions(currentPage) {
      var Options = {
        method: "get",
        url: `/api/transaction/${this.machine.id}/${this.perPage}?page=${currentPage}`,
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      };
      axios(Options).then((response) => {
        this.transactions = response.data;
      });
    },
    updatePage(value) {
      this.loadTransactions(value);
    },
    inventoryText(inventory){
      inventory = JSON.parse(inventory);
      let text = inventory.reduce( (description, value) => {
        return `${description} ${value.name}:${value.pivot.quantity};`;
      },'')
      return text;
    }
  },
  created() {
    if (!this.$route.params.machine) {
      this.$router.push("/manage/machine");
      return false;
    }

    this.token = localStorage.getItem("token");
    this.machine = this.$route.params.machine;
    this.loadTransactions(1);
  },
  watch: {
    showForm(value) {
      if (!value) this.$router.go(-1);
    },
  },
  filters: {
    friendlyDate: (date) => {
      let novaData = new Date(date);
      return novaData.toLocaleString("pt-BR");
    },
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
