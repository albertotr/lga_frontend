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
          Colaboradores
        </h5>
        <div class="row" style="margin-bottom:10px">
          <div class="col">
            <b-button squared variant="primary" @click="openAddOperatorModal()"
              ><font-awesome-icon icon="plus-circle" size="1x" /> Adicionar
              Colaborador</b-button
            >
          </div>
        </div>
        <b-table
          :items="manager.contributors"
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
          :state="contributorState"
        >
          <b-form-select
            v-model="contributor.id"
            :options="optionContributors"
            :state="contributorState"
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
  name: "Contributors",
  components: {
    "font-awesome-icon": FontAwesomeIcon,
  },
  props: {
    manager: Object,
  },
  data() {
    return {
      fields: [
        { key: "name", label: "Nome" },
        { key: "cpf_cnpj", label: "CPF/CNPJ" },
        { key: "action", label: "Ações" },
      ],

      contributor: {
        id: "",
      },
      contributorState: null,

      dismissSecs: 10,
      dismissCountDown: 0,
      alertType: "warning",
      alertMessage: "",

      state: null,
      validOperatorMessage: "",
      invalidOperatorValue: false,

      contributors: [],
      token: null,
    };
  },
  computed: {
    loadingTableResult() {
      return this.manager == null;
    },
    loadingTableOperatorResult() {
      return this.contributors == null;
    },
    optionContributors() {
      var listContributors = this.contributors.filter((contributor) => {
        return contributor.id !== this.manager.id;
      });

      listContributors = listContributors.map((contributor) => {
        return { value: contributor.id, text: contributor.name };
      });
      return listContributors;
    },
  },
  methods: {
    checkFormValidity() {
      this.invalidOperatorValue = false;
      this.contributorState = true;
      this.validOperatorsMessage = "";

      const valid = this.$refs.form.checkValidity();
      this.state = valid;

      if (!this.contributor.id) {
        this.validOperatorMessage = "Selecione um colaborador.";
        this.contributorState = false;
      }

      return valid;
    },
    resetModal() {
      this.contributor.id = "";
      this.contributorState = null;
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

      let newContributor = this.contributors.filter((contributor) => {
        return contributor.id == this.contributor.id;
      });
      newContributor = newContributor[0];

      let method = "POST";

      var Options = {
        method: method,
        url: `/api/operator/attachcontributor/${this.manager.id}`,
        data: newContributor,
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      };
      axios(Options)
        .then(() => {
          this.manager.contributors.push(newContributor);

          this.contributor.id = null;

          this.invalidContributorValue = false;
          this.contributor.State = null;
          this.validContributorMessage = "";
          this.$emit("updateDataTable", true);
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

    onOperatorDetach(contributor) {
      this.boxTwo = "";
      this.$bvModal
        .msgBoxConfirm(
          `Deseja realmente desvincular o Colaborador ${contributor.name}?`,
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
            var Options = {
              method: "POST",
              url: `/api/operator/detachcontributor/${this.manager.id}`,
              data: contributor,
              headers: {
                Authorization: `Bearer ${this.token}`,
              },
            };
            axios(Options)
              .then(() => {
                this.manager.contributors.splice(
                  this.manager.contributors.indexOf(contributor),
                  1
                );
                this.$emit("updateDataTable", true);
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
      var OptionsContributors = {
        method: "get",
        url: `/api/operator/contributors`,
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      };
      axios(OptionsContributors).then((response) => {
        this.contributors = response.data;
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
