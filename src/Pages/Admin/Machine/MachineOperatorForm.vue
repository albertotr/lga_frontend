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
        <h5 class="card-title">
          Operadores
        </h5>
        <div class="row" style="margin-bottom:10px">
          <div class="col">
            <b-button squared variant="primary" @click="openAddOperatorModal()"
              ><font-awesome-icon icon="plus-circle" size="1x" /> Adicionar
              Operador</b-button
            >
          </div>
        </div>
        <b-table
          :items="machine.operators"
          :fields="fields"
          striped
          bordered
          hover
          :busy="loadingTableResult"
          responsive="sm"
        >
          <template #cell(action)="obj" class="text-center">
            <font-awesome-icon
              icon="unlink"
              size="2x"
              class="text-info"
              @click="onOperatorDetach(obj.item)"
            />
          </template>

          <template #table-busy>
            <div class="text-center text-danger my-2">
              <b-spinner class="align-middle"></b-spinner>
              <strong>Carregando...</strong>
            </div>
          </template>
        </b-table>
      </div>
    </div>

    <b-modal
      id="attachOperatorModal"
      ref="modal"
      title="Operador"
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOk"
    >
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group
          label="Nome do Operador"
          label-for="id"
          :state="operatorState"
        >
          <b-form-select
            v-model="operator.id"
            :options="optionOperators"
            :state="operatorState"
            required
          ></b-form-select>
          <b-form-invalid-feedback :state="invalidOperatorValue">
            {{ validOperatorMessage }}
          </b-form-invalid-feedback>
        </b-form-group>
      </form>
    </b-modal>
  </div>
</template>

<script>
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faLink,
  faUnlink,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
library.add(faLink, faUnlink, faExclamationCircle);

export default {
  name: "MachineOperator",
  components: {
    "font-awesome-icon": FontAwesomeIcon,
  },
  props: {
    machine: Object,
  },
  data() {
    return {
      fields: [
        { key: "name", label: "Nome" },
        { key: "cpf_cnpj", label: "CPF/CNPJ" },
        { key: "action", label: "Ações" },
      ],

      operator: {
        id: "",
      },
      operatorState: null,

      dismissSecs: 10,
      dismissCountDown: 0,
      alertType: "warning",
      alertMessage: "",

      state: null,
      validOperatorMessage: "",
      invalidOperatorValue: false,

      operators: [],
      token: null,
    };
  },
  computed: {
    loadingTableResult() {
      return this.machine == null;
    },
    loadingTableOperatorResult() {
      return this.operators == null;
    },
    optionOperators() {
      var listOperators = this.operators.map((operator) => {
        return { value: operator.id, text: operator.name };
      });
      return listOperators;
    },
  },
  methods: {
    checkFormValidity() {
      this.invalidOperatorValue = false;
      this.operatorState = true;
      this.validOperatorsMessage = "";

      const valid = this.$refs.form.checkValidity();
      this.state = valid;

      if (!this.operator.id) {
        this.validOperatorMessage = "O valor nome é obrigatório.";
        this.operatorState = false;
      }

      return valid;
    },
    resetModal() {
      this.operator.id = "";
      this.operatorState = null;
    },
    handleOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();
      // Trigger submit handler
      this.handleSubmit();
    },
    handleSubmit() {
      // Exit when the form isn't valid
      if (!this.checkFormValidity()) {
        return;
      }

      let pivot = new Object();
      pivot.machine_id = this.machine.id;
      pivot.operator_id = this.operator.id;

      let newOperator = this.operators.filter((operator) => {
        return operator.id == this.operator.id;
      });
      newOperator = newOperator[0];

      const token = localStorage.getItem("token");
      let method = "POST";

      var Options = {
        method: method,
        url: "/api/machine/attachoperator",
        data: pivot,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      axios(Options)
        .then(() => {
          newOperator.pivot = pivot;
          this.machine.operators.push(newOperator);

          this.operator.id = null;

          this.invalidOperatorValue = false;
          this.operatorState = null;
          this.validOperatorMessage = "";
        })
        .catch((msg) => {
          this.alertMessage = msg.response.data;
          this.dismissCountDown = this.dismissSecs;
        });

      // Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide("attachOperatorModal");
      });

      return false;
    },

    onOperatorDetach(operator) {
      this.boxTwo = "";
      this.$bvModal
        .msgBoxConfirm(
          `Deseja realmente desvincular o operador ${operator.name}?`,
          {
            title: "Confirmar",
            size: "sm",
            buttonSize: "sm",
            okVariant: "success",
            okTitle: "Sim",
            cancelTitle: "Não",
            footerClass: "p-2",
            hideHeaderClose: false,
          }
        )
        .then((confirm) => {
          if (confirm) {
            let pivot = new Object();
            pivot.machine_id = this.machine.id;
            pivot.operator_id = operator.id;

            let method = "POST";

            var Options = {
              method: method,
              url: "/api/machine/detachoperator",
              data: pivot,
              headers: {
                Authorization: `Bearer ${this.token}`,
              },
            };
            axios(Options)
              .then(() => {
                delete operator.pivot;
                this.operators.push(operator);
                this.machine.operators.splice(
                  this.machine.operators.indexOf(operator),
                  1
                );
              })
              .catch((msg) => {
                this.alertMessage = msg.response.data;
                this.dismissCountDown = this.dismissSecs;
              });
          }
        });
    },

    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown;
    },

    openAddOperatorModal() {
      var OptionsOperator = {
        method: "get",
        url: `/api/operator/available/${this.machine.id}`,
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      };
      axios(OptionsOperator).then((response) => {
        this.operators = response.data;
      });
      this.$bvModal.show("attachOperatorModal");
    },
  },
  created() {
    this.token = localStorage.getItem("token");
  },
};
</script>

<style></style>
