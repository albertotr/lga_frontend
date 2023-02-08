<template>
  <div>
    <page-title
      :heading="heading"
      :subheading="subheading"
      :icon="icon"
    ></page-title>

    <div class="content">
      <b-card
        no-body
        class="mb-1"
        v-for="operator in operators"
        :key="operator.id"
      >
        <b-card-header header-tag="header" class="p-1" role="tab">
          <span
            >Operador: <strong>{{ operator.name }}</strong></span
          >
        </b-card-header>
        <b-card-body>
          <b-card-text>
            <b-row>
              <div v-for="machine in operator.machines" :key="machine.id">
                <div class="col">
                  <div class="row">
                    <div class="col-2">
                      <font-awesome-icon
                        v-if="machine.type_id == 1"
                        icon="dog"
                        size="2x"
                        class="text-info"
                      />
                      <font-awesome-icon
                        v-if="machine.type_id == 2"
                        icon="beer"
                        size="2x"
                        class="text-warning"
                      />
                      <font-awesome-icon
                        v-if="machine.type_id == 3"
                        icon="basketball-ball"
                        size="2x"
                        class="text-danger"
                      />
                    </div>

                    <div class="col" style="padding-left: 35px">
                      <div
                        class="row"
                      >
                        Maquina: {{ machine.name }}
                      </div>
                    
                      <div
                        class="row"
                      >
                        Ultima Messagem: 
                        <span v-if="machine.last_message">{{ machine.last_message.created_at | formatDate }}</span>
                        <span v-else style="color:red;">Não existe</span>
                      </div>

                      <div
                        class="row"
                      >
                        Ultima Transação: 
                        <span v-if="!machine.last_transaction" style="color:red;">Não existe</span>
                        <span v-if="machine.last_transaction && !machine.last_transaction.closure_id">{{ machine.last_transaction.created_at | formatDate }}</span>
                        <span v-if="machine.last_transaction && machine.last_transaction.closure_id" style="color:green;">{{ machine.last_transaction.created_at | formatDate }} (fechada)</span>
                      </div>

                      <div
                        class="row"
                      >
                        Valor na maquina: 
                        <span>{{ machine.balance | currency }}</span>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </b-row>
          </b-card-text>
        </b-card-body>
      </b-card>
    </div>
  </div>
</template>

<script>
import PageTitle from "../../../Layout/Components/PageTitle.vue";
import axios from "axios";
import { mapGetters } from "vuex";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faBasketballBall,
  faBeer,
  faDog,
} from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
library.add(faBasketballBall, faBeer, faDog);

export default {
  name: "OperatorTransaction",
  components: {
    PageTitle,
    "font-awesome-icon": FontAwesomeIcon,
  },
  data() {
    return {
      heading: "Relatório de Fechamento de Operadores",
      subheading: "Lista de Operadores e seus fechamentos de conta",
      icon: "users-cog",
      operators: null,
    };
  },
  computed: {
    ...mapGetters(["permissions"]),
  },
  methods: {},
  created() {
    const token = localStorage.getItem("token");
    var Options = {
      method: "get",
      url: "/api/operator/",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios(Options).then((response) => {
      this.operators = response.data;
    });
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
    formatDate(value){
      const date = new Date(value);
      return date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();
    }
  },
};
</script>

<style scoped>
</style>
