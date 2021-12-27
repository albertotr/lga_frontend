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
        <b-form-group
          label="Participação"
          label-for="participation"
          :state="participationState"
        >
          <b-form-input
            id="participation-input"
            v-model="operator.participation"
            :state="participationState"
            type="number"
            step="0.01"
            min="0.00"
            max="100.00"
            required
          ></b-form-input>
          <b-form-invalid-feedback :state="invalidParticipationValue">
            {{ validParticipationMessage }}
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
        { key: "pivot.participation", label: "Participação %" },
        { key: "action", label: "Ações" },
      ],

      operator: {
        id: "",
        participation: "",
      },
      operatorState: null,
      participationState: null,

      dismissSecs: 10,
      dismissCountDown: 0,
      alertType: "warning",
      alertMessage: "",

      state: null,
      validOperatorMessage: "",
      validParticipationMessage: "",
      invalidOperatorValue: false,
      invalidParticipationValue: false,

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
    totalParticipation() {
      var totalParticipation = 0;
      this.machine.operator.forEach((machineOperator) => {
        totalParticipation += parseFloat(machineOperator.pivot.participation);
      });
      return totalParticipation < 100;
    },
  },
  methods: {
    checkFormValidity() {
      this.invalidOperatorValue = false;
      this.operatorState = true;
      this.validOperatorsMessage = "";

      this.invalidParticipationValue = false;
      this.participationState = true;
      this.validParticipationMessage = "";

      const valid = this.$refs.form.checkValidity();
      this.state = valid;

      if (valid) {
        let errors = 0;
        let percentage = 0;
        this.machine.operators.forEach((operator) => {
          percentage += parseFloat(operator.pivot.participation);
        });

        percentage += parseFloat(this.operator.participation);

        if (percentage > 100) {
          this.invalidParticipationValue = true;
          this.validParticipationMessage =
            "Com este valor, é superado os 100% de participação.";
          this.participationState = false;
          errors++;
        }

        if (errors > 0) return false;
      } else {
        if (!this.operator.participation || this.operator.participation > 100) {
          this.validParticipationMessage = "O valor precisa ser entre 0 e 100.";
          this.participationState = false;
        }
        if (!this.operator.id) {
          this.validOperatorMessage = "O valor nome é obrigatório.";
          this.operatorState = false;
        }
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
      pivot.participation = this.operator.participation;

      let newOperator = this.operators.filter((operator) => {
        return operator.id == this.operator.id;
      });
      newOperator = newOperator[0];

      let method = "POST";

      var Options = {
        method: method,
        url: "/api/machine/attachoperator",
        data: pivot,
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      };
      axios(Options)
        .then(() => {
          newOperator.pivot = pivot;
          this.machine.operators.push(newOperator);

          this.operator.id = null;
          this.operator.participation  = null;

          this.invalidOperatorValue = false;
          this.operatorState = null;
          this.validOperatorMessage = "";

          this.invalidParticipationValue = false;
          this.participationState = null;
          this.validParticipationMessage = "";
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
