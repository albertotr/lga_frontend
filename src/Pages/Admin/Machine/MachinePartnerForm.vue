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
        <div class="row" style="margin-bottom:10px">
          <div class="col">
            <b-button
              squared
              variant="primary"
              @click="openAddPartnerModal()"
              v-if="totalParticipation"
              ><font-awesome-icon icon="plus-circle" size="1x" /> Adicionar
              Parceiro</b-button
            >
          </div>
        </div>
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
          label="Nome do Parceiro"
          label-for="id"
          :state="partnerState"
        >
          <b-form-select
            v-model="partner.id"
            :options="optionPartners"
            :state="partnerState"
            required
          ></b-form-select>
          <b-form-invalid-feedback :state="invalidPartnerValue">
            {{ validPartnerMessage }}
          </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group
          label="Participação"
          label-for="participation"
          :state="participationState"
        >
          <b-form-input
            id="participation-input"
            v-model="partner.participation"
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
  name: "MachinePartner",
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

      partner: {
        id: "",
        participation: "",
      },
      participationState: null,
      partnerState: null,

      dismissSecs: 10,
      dismissCountDown: 0,
      alertType: "warning",
      alertMessage: "",

      state: null,
      validParticipationMessage: "",
      validPartnerMessage: "",
      invalidPartnerValue: false,
      invalidParticipationValue: false,

      partners: [],
      token: null,
    };
  },
  computed: {
    loadingTableResult() {
      return this.machine == null;
    },
    loadingTablePartnerResult() {
      return this.partners == null;
    },
    totalParticipation() {
      var totalParticipation = 0;
      this.machine.partners.forEach((machinePartner) => {
        totalParticipation += parseFloat(machinePartner.pivot.participation);
      });
      return totalParticipation < 100;
    },
    optionPartners() {
      var listPartners = this.partners.map((partner) => {
        return { value: partner.id, text: partner.name };
      });
      return listPartners;
    },
  },
  methods: {
    checkFormValidity() {
      this.invalidPartnerValue = false;
      this.partnerState = true;
      this.validPartnerMessage = "";

      this.invalidParticipationValue = false;
      this.participationState = true;
      this.validParticipationMessage = "";

      const valid = this.$refs.form.checkValidity();
      this.state = valid;

      if (valid) {
        let errors = 0;
        let percentage = 0;
        this.machine.partners.forEach((partner) => {
          percentage += parseFloat(partner.pivot.participation);
        });

        percentage += parseFloat(this.partner.participation);

        if (percentage > 100) {
          this.invalidParticipationValue = true;
          this.validParticipationMessage =
            "Com este valor, é superado os 100% de participação.";
          this.participationState = false;
          errors++;
        }

        if (errors > 0) return false;
      } else {
        if (!this.partner.participation || this.partner.participation > 100) {
          this.validParticipationMessage = "O valor precisa ser entre 0 e 100.";
          this.participationState = false;
        }

        if (!this.partner.id) {
          this.validPartnerMessage = "O valor nome é obrigatório.";
          this.partnerState = false;
        }
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
      pivot.partner_id = this.partner.id;
      pivot.participation = this.partner.participation;

      let newPartner = this.partners.filter((partner) => {
        return partner.id == this.partner.id;
      });
      newPartner = newPartner[0];

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
          newPartner.pivot = pivot;
          this.machine.partners.push(newPartner);
          --this.machine.partners_count;

          this.partner.id = null;
          this.partner.participation  = null;

          this.invalidPartnerValue = false;
          this.partnerState = null;
          this.validPartnerMessage = "";

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
        this.$bvModal.hide("informParticipation");
      });

      return false;
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

            let method = "POST";

            var Options = {
              method: method,
              url: "/api/machine/detachpartner",
              data: pivot,
              headers: {
                Authorization: `Bearer ${this.token}`,
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

    openAddPartnerModal() {
      var OptionsPartner = {
        method: "get",
        url: `/api/partner/available/${this.machine.id}`,
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      };
      axios(OptionsPartner).then((response) => {
        this.partners = response.data;
      });
      this.$bvModal.show("informParticipation");
    },
  },
  created() {
    this.token = localStorage.getItem("token");
  },
};
</script>

<style></style>
