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
        <div class="d-flex justify-content-between">
          <div class="col-6 p-0">
            <h5 class="card-title">
              Fechamento
            </h5>
          </div>
          <div class="col-6 p-0 d-flex justify-content-end">
            <b-form-group
              v-slot="{ ariaDescribedby }"
              class="col-xs-12 col-sm-8 col-lg-8"
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
          </div>
        </div>

        <div class="row mb-0" v-if="!totals && selected">
          <div class="col text-center text-danger my-2">
            <b-spinner class="align-middle"></b-spinner>
            <strong>Carregando totais...</strong>
          </div>
        </div>
        <b-jumbotron container-fluid v-if="totals && selected" class="p-2 mb-3">
          <div class="row mb-0">
            <div class="col-12 col-lg-3">
              <div class="row p-0">
                <div class="col-6 col-lg-12">
                  <b-badge class="label"
                    >Total coletado [{{ totals.count }}]</b-badge
                  >
                </div>
                <div class="col-6 col-lg-12">
                  {{ totals.amount | currency }}
                </div>
              </div>
            </div>
            <div class="col-12 col-lg-3">
              <div class="row p-0">
                <div class="col-6 col-lg-12">
                  <b-badge class="label">Custo total</b-badge>
                </div>
                <div class="col-6 col-lg-12">{{ totals.cost | currency }}</div>
              </div>
            </div>

            <div class="col-12 col-lg-3">
              <div class="row p-0">
                <div class="col-6 col-lg-12">
                  <b-badge class="label">Descontos</b-badge>
                </div>
                <div class="col-6 col-lg-12">
                  {{ totals.fixed | currency }}F | {{ totals.net | currency }}L
                  | {{ totals.gross | currency }}B
                </div>
              </div>
            </div>

            <div class="col-12 col-lg-3">
              <div class="row p-0">
                <div class="col-6 col-lg-12">
                  <b-badge class="label">Comissões</b-badge>
                </div>
                <div class="col-6 col-lg-12">
                  {{ totals.totalCommission | currency }}
                </div>
              </div>
            </div>
          </div>
        </b-jumbotron>

        <div class="row mb-0" v-if="!transactions && selected">
          <div class="col text-center text-danger my-2">
            <b-spinner class="align-middle"></b-spinner>
            <strong>Carregando transações...</strong>
          </div>
        </div>
        <div class="row mb-0 pl-3 pr-3" v-if="transactions && selected">
          <div class="col-12 mb-0 p-0">
            <h5 class="text-info">Transações</h5>
          </div>
          <div class="col-12 mb-3 p-0" v-if="transactions">
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

        <div class="row mb-0">
          <div class="col-12">
            <button
              class="mt-2 btn btn-primary"
              @click.stop="onSubmit"
              :disabled="selected == null"
            >
              Salvar
            </button>
            <button class="mt-2 btn btn-warning" @click.stop="onCancel">
              Retornar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";
import VuePerfectScrollbar from "vue-perfect-scrollbar";

export default {
  name: "closure",
  data() {
    return {
      contributors: null,
      selected: null,
      transactions: null,
      totals: null,
      error: null,

      dismissSecs: 10,
      dismissCountDown: 0,
      alertType: "success",
      alertMessage: "",
    };
  },
  components: {
    VuePerfectScrollbar,
  },
  methods: {
    onSubmint() {
      return false;
    },
    onCancel() {
      this.$router.go(-1);
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
    loadTransactions() {
      var Options = {
        method: "get",
        url: `/api/transaction/opened/${this.selected}`,
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      };
      axios(Options).then((response) => {
        this.transactions = response.data;
      });
    },

    loadTotalTransactions() {
      var Options = {
        method: "get",
        url: `/api/transaction/totalClosure/${this.selected}`,
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      };
      axios(Options).then((response) => {
        this.totals = response.data;
      });
    },
    getInventory(transaction) {
      let inventory = JSON.parse(transaction.inventory);
      return inventory.map((inv) => inv.pivot.quantity);
    },
    onSubmit() {
      let data = {
        user_id: this.user.id,
        operator_id: this.selected,
        transactions: this.transactions.map((transaction) => transaction.id),
      };
      var Options = {
        method: "post",
        data: data,
        url: `/api/closure`,
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      };
      axios(Options)
        .then(() => {
          this.onCancel();
        })
        .catch((msg) => {
          this.alertType = 'warning';
          this.alertMessage = msg.response.data[0];
          this.dismissCountDown = this.dismissSecs;
        });
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown;
    },
  },
  created() {
    this.loadContributors();
  },
  watch: {
    selected(next) {
      if (next == null) this.transactions = null;
      else {
        this.transactions = null;
        this.loadTransactions();
        this.loadTotalTransactions();
      }
    },
  },
  computed: {
    ...mapGetters(["user", "permissions"]),
    options() {
      let optionList = this.contributors.map((contributor) => {
        return { text: contributor.name, value: contributor.user_id };
      });

      return [{ text: "Selecione um operador", value: null }, ...optionList];
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

<style scoped>
.label {
  font-size: 0.8em;
  line-height: 0.6em;
  border: 1px solid #999;
  background-color: transparent;
}
</style>
