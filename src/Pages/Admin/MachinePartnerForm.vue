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
          Parceiros
        </h5>
        <b-table
          :items="machine.partners"
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
              @click="onPartnerDetach(obj.item)"
            />
          </template>

          <template #table-busy>
            <div class="text-center text-danger my-2">
              <b-spinner class="align-middle"></b-spinner>
              <strong>Carregando...</strong>
            </div>
          </template>
        </b-table>

        <h5>Parceiros Disponiveis</h5>
        <b-table
          :items="partners"
          :fields="fieldsPartner"
          striped
          bordered
          hover
          :busy="loadingTablePartnerResult"
          responsive="sm"
        >
          <template #cell(action)="obj">
            <font-awesome-icon
              icon="link"
              size="2x"
              class="text-info"
              @click="onPartnerAttach(obj.item)"
              v-b-modal.informParticipation
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
      id="informParticipation"
      ref="modal"
      title="Participação"
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOk"
    >
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group
          label="Participação"
          label-for="participation"
          :state="participationState"
        >
          <b-form-input
            id="participation-input"
            v-model="participation"
            :state="participationState"
            type="number"
            step="0.01"
            min="0.00"
            max="100.00"
            required
          ></b-form-input>
          <b-form-invalid-feedback :state="invalidValue">
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
import { faLink, faUnlink, faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
library.add(faLink, faUnlink, faExclamationCircle);

export default {
  name: "MachinePartner",
  components: {
    "font-awesome-icon": FontAwesomeIcon,
  },
  props: {
    machine: Object,
    partners: [],
  },
  data() {
    return {
      fields: [
        { key: "name", label: "Nome" },
        { key: "cpf_cnpj", label: "CPF/CNPJ" },
        { key: "pivot.participation", label: "Participação %" },
        { key: "action", label: "Ações" },
      ],

      fieldsPartner: [
        { key: "name", label: "Nome" },
        { key: "cpf_cnpj", label: "CPF/CNPJ" },
        { key: "action", label: "Ações" },
      ],
      participation: "",
      participationState: null,
      submittedNames: [],
      selectedPartnerAdd: null,
      dismissSecs: 10,
      dismissCountDown: 0,
      alertType: "warning",
      alertMessage: "",
      validParticipationMessage: "",
      invalidValue: false,
    };
  },
  computed: {
    loadingTableResult() {
      return this.machine == null;
    },
    loadingTablePartnerResult() {
      return this.partners == null;
    },
  },
  methods: {
    checkFormValidity() {
      const valid = this.$refs.form.checkValidity();
      this.participationState = valid;

      if (valid) {
        let percentage = 0;
        this.machine.partners.forEach((partner) => {
          percentage += parseFloat(partner.pivot.participation);
        });

        percentage += parseFloat(this.participation);

        this.validParticipationMessage =
          "Com este valor, é superado os 100% de participação.";
        this.validation = true;
        return 100 >= percentage;
      } else {
        this.validParticipationMessage = "O valor precisa ser entre 0 e 100.";
        this.validation = true;
      }

      return valid;
    },
    resetModal() {
      this.participation = "";
      this.participationState = null;
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
      pivot.partner_id = this.selectedPartnerAdd.id;
      pivot.participation = this.participation;

      const token = localStorage.getItem("token");
      let method = "POST";

      var Options = {
        method: method,
        url: "/api/machine/attachpartner",
        data: pivot,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      axios(Options)
        .then(() => {
          this.selectedPartnerAdd.pivot = pivot;
          this.machine.partners.push(this.selectedPartnerAdd);
          --this.machine.partners_count;

          this.partners.splice(
            this.partners.indexOf(this.selectedPartnerAdd),
            1
          );

          this.validParticipationMessage = "";
          this.validation = false;
        })
        .catch((msg) => {
          this.alertMessage = msg.response.data;
          this.dismissCountDown = this.dismissSecs;
        });

      // Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide("informParticipation");
      });

      return false;
    },
    onPartnerAttach(partner) {
      this.selectedPartnerAdd = partner;
    },

    onPartnerDetach(partner) {
      this.boxTwo = "";
      this.$bvModal
        .msgBoxConfirm(
          `Deseja realmente desvincular o parceiro ${partner.name}?`,
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
            pivot.partner_id = partner.id;

            const token = localStorage.getItem("token");
            let method = "POST";

            var Options = {
              method: method,
              url: "/api/machine/detachpartner",
              data: pivot,
              headers: {
                Authorization: `Bearer ${token}`,
              },
            };
            axios(Options)
              .then(() => {
                delete partner.pivot;
                this.partners.push(partner);
                this.machine.partners.splice(
                  this.machine.partners.indexOf(partner),
                  1
                );
                --this.machine.partners_count;
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
  },
};
</script>

<style></style>
