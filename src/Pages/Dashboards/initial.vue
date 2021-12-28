<template>
  <div>
    <div class="mb-3 card">
      <div class="card-header-tab card-header">
        <div
          class="card-header-title font-size-lg text-capitalize font-weight-normal"
        >
          <input type="checkbox" v-model="isShowMachine" />&nbsp;
          <font-awesome-icon icon="database" />&nbsp; Maquinas
        </div>
      </div>
      <div class="no-gutters row" v-if="isShowMachine">
        <machine v-for="mac in machines" :machine="mac" :key="mac.id" />
      </div>
      <div
        class="text-center p-3 card-footer d-none d-md-block"
        v-if="isShowMachine"
      >
        <button
          class="btn-pill btn-shadow btn-wide fsize-1 btn btn-primary btn-lg"
          @click="loadMachine()"
        >
          <span class="mr-2 opacity-7">
            <i class="icon icon-anim-pulse ion-ios-analytics-outline"></i>
          </span>
          <span class="mr-1">Recarregar</span>
        </button>
      </div>
    </div>
    <div class="mb-3 card" v-if="permissions.includes('view-operators')">
      <div class="card-header-tab card-header">
        <div
          class="card-header-title font-size-lg text-capitalize font-weight-normal"
        >
          <input type="checkbox" v-model="isShowOperators" />&nbsp;
          <font-awesome-icon icon="tools" />&nbsp; Operadores
        </div>
      </div>
      <div class="no-gutters row" v-if="isShowOperators">
        <operator
          v-for="operator in operators"
          :operator="operator"
          :key="operator.id"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Machine from "./gadget/machine";
import Operator from "./gadget/Operator.vue";
import axios from "axios";
import { mapGetters } from "vuex";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faDatabase, faTools } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
library.add(faDatabase, faTools);
export default {
  components: { Machine, FontAwesomeIcon, Operator },
  name: "initial",
  data() {
    return {
      machines: [],
      operators: [],
      isShowMachine: false,
      isShowOperators: true,
    };
  },
  methods: {
    loadMachine() {
      this.lastreload = null;
      var Options = {
        method: "get",
        url: "/api/machine/",
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      };
      axios(Options).then((response) => {
        this.machines = response.data;
      });
    },
    loadOperator() {
      var Options = {
        method: "get",
        url: `/api/operator/contributors/${this.user.id}`,
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      };
      axios(Options).then((response) => {
        this.operators = response.data;
      });
    },
  },
  created() {
    this.loadMachine();
    this.loadOperator();
  },
  computed: {
    ...mapGetters(["user", "permissions"]),
  },
};
</script>

<style></style>
