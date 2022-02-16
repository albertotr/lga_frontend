<template>
  <div class="content row mb-3">
    <b-col xs-12>
      <b-card>
        <div class="row no-gutters">
          <div class="col-4">
            <h5 class="card-title">
              <font-awesome-icon
                icon="lightbulb"
                size="1x"
                class="text-info"
              />&nbsp;Status
            </h5>
          </div>
          <div class="col-8">
            <div class="row" v-if="machines">
              <div class="col-4">
                <div class="widget-numbers text-info" v-if="machines">
                  Total {{ machines.total }}
                </div>
                <div class="widget-numbers text-info" v-else>*</div>
              </div>

              <div class="col-4">
                <div class="widget-numbers text-success">
                  Online {{ machines.online }}
                </div>
              </div>
              <div class="col-4">
                <div class="widget-numbers text-danger">
                  Offline {{ machines.offline }}
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
      machines: null,
    };
  },
  methods: {
    loadMachines() {
      var Options = {
        method: "get",
        url: "/api/machine/status",
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
    this.token = localStorage.getItem("token");
    this.loadMachines();
  },
  computed: {
    ...mapGetters(["user", "permissions"]),
  },
};
</script>

<style></style>
