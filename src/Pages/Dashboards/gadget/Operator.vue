<template>
  <div class="col-12">
    <ul class="list-group">
      <li class="list-group-item active">{{ operator.name }}</li>
      <li v-for="machine in machines" :key="machine.id" class="list-group-item">
        <div class="row">
          <div class="col-xs-12 col-sm">
            <span class="text-dark text-uppercase"
              ><font-awesome-icon icon="database" />&nbsp;{{ machine.name }}</span
            >
          </div>
          <div class="col-xs-12 col-sm">{{ machine.pivot.participation }}%</div>
          <div class="col-xs-12 col-sm">Saldo: R${{ machine.balance }}</div>
          <div class="col-xs-12 col-sm">Custo: R${{ machine.cost }}</div>
          <div class="col-xs-12 col-sm" v-if="machine.last_transaction">
            Coleta: {{ machine.last_transaction.created_at | formatDate }}
          </div>
          <div class="col-xs-12 col-sm" v-else>Coleta: 00/00/0000</div>
          <div class="col-xs-12 col-sm" v-if="machine.last_message">
            Msg: {{ machine.last_message.created_at | formatDate }}
          </div>
          <div class="col-xs-12 col-sm" v-else>Msg: 00/00/0000</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faDatabase } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
library.add(faDatabase);
export default {
  name: "OperatorDashboard",
  data() {
    return {
      machines: [],
    };
  },
  methods: {
  },
  components: {
    FontAwesomeIcon,
  },
  props: {
    operator: Object,
  },
  created() {
    this.lastreload = null;
    var Options = {
      method: "get",
      url: `api/operator/machine/${this.operator.id}`,
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    };
    axios(Options).then((response) => {
      this.machines = response.data;
    });
  },
  computed: {
    ...mapGetters(["user"]),
  },
  filters: {
    formatDate(date) {
      if (date) {
        const options = {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        };
        return new Date(date).toLocaleString("pt-BR", options);
      }
    },
  },
};
</script>

<style scoped>
.list-group-item {
  padding: 0px 0px 0px 15px;
}

.list-group-item.active {
  border: 0px;
}

.list-group {
  margin: 10px 15px 0px 15px;
}
</style>
