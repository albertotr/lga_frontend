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
          <template #cell(action)="obj">
            <font-awesome-icon
              icon="edit"
              size="2x"
              class="text-info"
              @click="onEditMachine(obj.item)"
              v-if="permissions.includes('update-machine')"
            />
            &nbsp;
            <font-awesome-icon
              icon="trash"
              size="2x"
              class="text-danger"
              @click="onDeleteMachine(obj.item)"
              v-if="
                permissions.includes('delete-machine') &&
                  obj.item.partners_count == 0
              "
            />
          </template>

          <template #table-busy>
            <div class="text-center text-danger my-2">
              <b-spinner class="align-middle"></b-spinner>
              <strong>Carregando...</strong>
            </div>
          </template>
        </b-table>

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
              icon="handshake"
              size="2x"
              class="text-info"
              @click="onPartnerSelected(obj.item)"
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
import { faHandshake } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
library.add(faHandshake);

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
    onPartnerSelected(partner) {
      this.selectedPartnerAdd = partner;
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown;
    },
  },
};
</script>

<style></style>
