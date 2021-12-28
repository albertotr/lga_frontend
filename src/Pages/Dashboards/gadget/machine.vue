<template>
  <div class="col-sm-6 col-md-4 col-xl-3">
    <div class="card rm-border bg-transparent widget-chart text-left">
      <div class="widget-chart-content">
        <div class="widget-subheading" v-if="machine.name">
          <font-awesome-icon
            icon="thumbs-up"
            class="text-success fa-1x"
            v-if="machine.online"
          />
          <font-awesome-icon
            icon="thumbs-down"
            class="text-danger fa-1x"
            v-else
          />
          {{ machine.name }}
        </div>
        <div class="widget-subheading" v-else>
          <font-awesome-icon
            icon="thumbs-up"
            class="text-success fa-1x"
            v-if="machine.online"
          />
          <font-awesome-icon
            icon="thumbs-down"
            class="text-danger fa-1x"
            v-else
          />
        </div>
        <div class="widget-numbers">R${{ machine.balance }}</div>
        <div class="widget-subheading" v-if="machine.location">
          <font-awesome-icon icon="map-marker-alt" class="text-purple" />
          {{ machine.location.name }}
        </div>
        <div class="widget-subheading" v-if="machine.operators">
          <font-awesome-icon icon="users-cog" class="text-teal" />&nbsp;
          <span v-for="operator in machine.operators" :key="operator.id"
            >{{ operator.name }} {{ operator.pivot.participation }}%;&nbsp;
          </span>
        </div>
        <div class="widget-subheading" v-else>Sem localização</div>
        <div
          class="widget-description opacity-8 text-focus"
          style="margin-top:0px;"
        >
          <div class="column">
            <div class="col" style="padding:0px">
              <div class="d-inline text-info pr-1">
                <span class="pl-1"
                  ><font-awesome-icon icon="tags" /> {{ totalInventory }}</span
                >
                <span class="pl-1"
                  ><font-awesome-icon icon="dollar-sign" />{{
                    machine.cost
                  }}</span
                >
              </div>
            </div>
            <div class="col" style="padding:0px">
              <b-button-group>
                <b-button
                  class="btn-success"
                  style="color:white"
                  @click="onShowTransaction(machine.id)"
                >
                  <font-awesome-icon icon="hand-holding-usd" />
                  <strong>Sacar</strong>
                </b-button>
                <b-button
                  class="btn-info"
                  style="color:white"
                  :disabled="cantEditMachine"
                  @click="
                    $router.push({
                      name: 'managemachineedit',
                      params: { machine: machine.id },
                    })
                  "
                >
                  <font-awesome-icon icon="edit" /> <strong>Editar</strong>
                </b-button>
              </b-button-group>
            </div>
          </div>
        </div>
      </div>
    </div>

    <b-modal
      id="transactionModal"
      :ref="machine.id"
      v-if="machine"
      :title="`Transação Maquina ${machine.serial}`"
      hide-footer
    >
      <transaction :machine="machine" />
    </b-modal>
  </div>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faAngleDown,
  faAngleUp,
  faDatabase,
  faTags,
  faHandHoldingUsd,
  faDollarSign,
  faThumbsUp,
  faThumbsDown,
  faEdit,
  faMapMarkerAlt,
  faUsersCog,
} from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
library.add(
  faAngleDown,
  faAngleUp,
  faDatabase,
  faTags,
  faHandHoldingUsd,
  faDollarSign,
  faThumbsUp,
  faThumbsDown,
  faEdit,
  faMapMarkerAlt,
  faUsersCog
);
import { mapGetters } from "vuex";
import Transaction from "../../Manager/Machine/Transaction.vue";

export default {
  name: "machine_gadget",
  components: {
    FontAwesomeIcon,
    Transaction,
  },
  props: {
    machine: Object,
  },
  computed: {
    totalInventory() {
      return this.machine.inventory.items.reduce(
        (partial_sum, item) => partial_sum + item.pivot.quantity,
        0
      );
    },
    cantEditMachine() {
      return !this.permissions.includes("update-machine");
    },
    ...mapGetters(["permissions"]),
  },
  methods: {
    onShowTransaction(id) {
      this.$refs[id].show();
    },
  },
};
</script>

<style lang="css">
.text-purple {
  color: #6f42c1;
}

.text-indigo {
  color: #6610f2;
}

.text-teal {
  color: #20c997;
}
</style>
