<template>
  <div>
    <page-title
      :heading="heading"
      :subheading="subheading"
      :icon="icon"
      :showForm.sync="goBack"
    ></page-title>
    <div class="content">
      <div class="col-12 mb-3 p-0" v-if="transactions">
        <div class="col-12 mb-0 p-0">
          <h5 class="text-info">Operador: <span class="text-color-black"> {{ transactions[0].user.name }}</span></h5>
        </div>
        <div class="col-12 mb-3 p-0">
          <div class="row font-weight-bold">
            <div class="col">
              Maquina
            </div>
            <div class="col">
              Sacado
            </div>
            <div class="col d-none d-sm-block">
              Inventário
            </div>
            <div class="col d-none d-sm-block">
              Criada em
            </div>
          </div>
          <div class="scroll-area-sm">
            <VuePerfectScrollbar class="scrollbar-container">
              <ul
                class="list-group"
                v-for="transaction in transactions"
                :key="transaction.id"
              >
                <li class="list-group-item pl-2 p-0">
                  <div class="row">
                    <div class="col">
                      {{ transaction.machine.name }}
                    </div>
                    <div class="col">
                      {{ transaction.amount | currency }}
                      <span v-if="transaction.amount != transaction.balance"
                        >*</span
                      >
                    </div>
                    <div class="col d-none d-sm-block">
                      {{ getInventory(transaction) }}
                    </div>
                    <div class="col d-none d-sm-block">
                      {{ transaction.created_at | friendlyDate }}
                    </div>
                  </div>
                </li>
              </ul>
            </VuePerfectScrollbar>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PageTitle from "../../../Layout/Components/PageTitle.vue";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import axios from "axios";
export default {
  name: "Transactions",
  components: {
    PageTitle,
    VuePerfectScrollbar,
  },
  data() {
    return {
      token: null,
      transactions: null,
      heading: "Transações do fechamento",
      subheading: "",
      icon: "pe-7s-repeat text-info",
      goBack: true,
    };
  },
  watch: {
    goBack(value) {
      if (!value) this.$router.go(-1);
    },
  },
  methods: {
    loadTransactions() {
      var Options = {
        method: "get",
        url: `/api/closure/transactions/${this.$route.params.closure}`,
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      };
      axios(Options).then((response) => {
        this.transactions = response.data;
      });
    },
    getInventory(transaction) {
      let inventory = JSON.parse(transaction.inventory);
      return inventory.map((inv) => inv.pivot.quantity);
    },
  },
  created() {
    this.token = localStorage.getItem("token");
    this.loadTransactions();
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

<style scoped>
.label {
  font-size: 0.8em;
  line-height: 0.6em;
  border: 1px solid #999;
  background-color: transparent;
}
.text-color-black {
    color:#5a5a5a;
}
</style>
