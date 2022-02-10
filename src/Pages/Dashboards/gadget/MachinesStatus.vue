<template>
  <div class="content row mb-3">
    <b-col xs-12>
      <b-card>
        <h5 class="card-title">
          <font-awesome-icon
            icon="lightbulb"
            size="1x"
            class="text-info"
          />&nbsp;Status
        </h5>
        <div class="no-gutters row" v-if="machines">
          <div class="col-md-12 col-lg-4">
            <ul class="list-group list-group-flush">
              <li class="bg-transparent list-group-item">
                <div class="widget-content p-0">
                  <div class="widget-content-outer">
                    <div class="widget-content-wrapper">
                      <div class="widget-content-left">
                        <div class="widget-heading">Maquinas</div>
                        <div class="widget-subheading">
                          Total de maquinas vinculadas
                        </div>
                      </div>
                      <div class="widget-content-right">
                        <div class="widget-numbers text-info" v-if="machines">
                          {{ machines.total }}
                        </div>
                        <div class="widget-numbers text-info" v-else>*</div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div class="col-md-12 col-lg-4">
            <ul class="list-group list-group-flush">
              <li class="bg-transparent list-group-item">
                <div class="widget-content p-0">
                  <div class="widget-content-outer">
                    <div class="widget-content-wrapper">
                      <div class="widget-content-left">
                        <div class="widget-heading">Online</div>
                        <div class="widget-subheading">
                          Total de maquinas online
                        </div>
                      </div>
                      <div class="widget-content-right">
                        <div class="widget-numbers text-success">
                          {{ machines.online }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div class="col-md-12 col-lg-4">
            <ul class="list-group list-group-flush">
              <li class="bg-transparent list-group-item">
                <div class="widget-content p-0">
                  <div class="widget-content-outer">
                    <div class="widget-content-wrapper">
                      <div class="widget-content-left">
                        <div class="widget-heading">Offline</div>
                        <div class="widget-subheading">
                          Total de Maquinas offline
                        </div>
                      </div>
                      <div class="widget-content-right">
                        <div class="widget-numbers text-danger">
                          {{ machines.offline }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div v-else>
          <div class="text-center text-danger my-2">
            <b-spinner class="align-middle"></b-spinner>
            <strong>Carregando...</strong>
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
