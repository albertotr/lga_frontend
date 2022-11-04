<template>
  <div class="content row mb-3">
    <b-col xs-12>
      <b-card>
        <div class="row no-gutters">
          <div class="col-12 col-md-2">
            <h5 class="card-title">
              <font-awesome-icon
                icon="lightbulb"
                size="1x"
                class="text-info"
              />&nbsp;Status Bichinhos
            </h5>
          </div>
          <div class="col-10">
            <div class="row mb-1" v-if="totals">
              <div class="col-4 col-lg-3 mb-1">
                <b-badge class="label-total" variant="info">Entradas</b-badge
                ><br />
                <span class="machine-content">{{
                  totals.inValue | currency
                }}</span>
              </div>
              <div class="col-4 col-lg-3 mb-1">
                <b-badge class="label-total" variant="info">Saidas</b-badge
                ><br />
                <span class="machine-content"
                  >{{ totals.outValue | currency }} | {{ totals.outQtd }}</span
                >
              </div>
              <div class="col-4 col-lg-3 mb-1">
                <b-badge class="label-total" variant="info">Lucro</b-badge
                ><br />
                <span class="machine-content">{{
                  (totals.inValue - totals.outValue) | currency
                }}</span>
              </div>
              <div class="col-12 col-lg-3 mb-1">
                <b-badge class="label-total" variant="info"
                  >Melhor Maquina</b-badge
                ><br />
                <span class="machine-content"
                  >{{ totals.bestName }} &nbsp;{{
                    totals.bestValue | currency
                  }}
                  - {{ totals.bestCost | currency }} ({{ totals.bestQtd }}) =
                  {{ (totals.bestValue - totals.bestCost) | currency }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </b-card>
    </b-col>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faLightbulb } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
library.add(faLightbulb);

export default {
  name: "MachineStatus",
  components: {
    "font-awesome-icon": FontAwesomeIcon,
  },
  data() {
    return {
      token: null,
      totals: null,
    };
  },
  methods: {
    
    loadMachineTotal() {
      var Options = {
        method: "get",
        data: this.data,
        url: `/api/machine/totals`,
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      };
      axios(Options).then((response) => {
        this.totals = response.data;
      });
    },
  },
  created() {
    this.token = localStorage.getItem("token");
    this.loadMachineTotal();
  },
  computed: {
    ...mapGetters(["user", "permissions"]),
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
  },
};
</script>

<style></style>
