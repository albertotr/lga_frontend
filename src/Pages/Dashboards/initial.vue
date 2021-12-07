<template>
  <div>
    <div class="mb-3 card">
      <div class="card-header-tab card-header">
        <div
          class="card-header-title font-size-lg text-capitalize font-weight-normal"
        >
          <i class="header-icon lnr-charts icon-gradient bg-happy-green"> </i>
          Maquinas
        </div>
      </div>
      <div class="no-gutters row">
        <machine v-for="mac in machines" :machine="mac" :key="mac.id" />
      </div>
      <div class="text-center p-3 card-footer d-none d-md-block">
        <button
          class="btn-pill btn-shadow btn-wide fsize-1 btn btn-primary btn-lg"
          @click="loadMachine()"
        >
          <span class="mr-2 opacity-7" >
            <i class="icon icon-anim-pulse ion-ios-analytics-outline"></i>
          </span>
          <span class="mr-1">Recarregar</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Machine from "./gadget/machine";
import axios from "axios";
export default {
  components: { Machine },
  name: "initial",
  data() {
    return {
      machines: [],
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
  },
  created() {
    this.loadMachine();
  },
};
</script>

<style></style>
