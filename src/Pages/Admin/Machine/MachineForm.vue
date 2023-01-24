<template>
  <div class="content">
    <div class="main-card mb-3 card">
      <div class="card-body">
        <h5 class="card-title">
          <span v-if="form.id == null">Cadastro</span
          ><span v-else>Edição</span> de Maquinas
        </h5>
        <form class="" @submit.prevent>
          <div class="form-row">
            <div class="col-md-4">
              <div class="position-relative form-group">
                <label for="labelFormName" class="">Nome</label
                ><input
                  name="name"
                  id="formName"
                  placeholder="Digite o name da máquina"
                  type="text"
                  class="form-control"
                  v-model="form.name"
                  :disabled="user.role.level >= 3"
                />
              </div>
            </div>
            <div class="col-md-3">
              <div class="position-relative form-group">
                <label for="labelFormSerial" class="">Serial</label
                ><input
                  name="serial"
                  id="formSerial"
                  placeholder="Digite o serial da máquina"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': invalidSerial }"
                  v-model="form.serial"
                  :disabled="user.role.level >= 3"
                />
                <div class="invalid-feedback">
                  <ul>
                    <li v-for="msg in invalidSerialMessage" :key="msg">
                      {{ msg }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="position-relative form-group">
                <label for="labelFormDevice" class="">MacAddress</label>
                <select
                  name="device"
                  id="formDevice"
                  class="form-control"
                  v-model="form.device"
                  :disabled="user.role.level >= 3"
                >
                  <option value="null">&nbsp;</option>
                  <option
                    v-for="device in devices"
                    :key="device.id"
                    :value="device.id"
                    >{{ device.mac }}</option
                  >
                </select>
              </div>
            </div>
            <div class="col-md-2">
              <div class="position-relative form-group">
                <label for="labelFormType" class="">Tipo</label>
                <select
                  name="type"
                  id="formType"
                  class="form-control"
                  :class="{ 'is-invalid': invalidType }"
                  v-model="form.type"
                  :disabled="user.role.level >= 3"
                >
                  <option
                    v-for="type in types"
                    :key="type.id"
                    :value="type.id"
                    >{{ type.name }}</option
                  >
                </select>
                <div class="invalid-feedback">
                  <ul>
                    <li v-for="msg in invalidTypeMessage" :key="msg">
                      {{ msg }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="position-relative form-group">
                <label for="labelFormSample" class="">Modelo</label>
                <select
                  name="sample"
                  id="formSample"
                  class="form-control"
                  :class="{ 'is-invalid': invalidSample }"
                  v-model="form.sample"
                  @change="updateSlot($event)"
                  :disabled="user.role.level >= 3"
                >
                  <option
                    v-for="sample in samples"
                    :key="sample.id"
                    :value="sample.id"
                    >{{ sample.name }}</option
                  >
                </select>
                <div class="invalid-feedback">
                  <ul>
                    <li v-for="msg in invalidSampleMessage" :key="msg">
                      {{ msg }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="col-md-2">
              <div class="position-relative form-group">
                <label for="labelFormSlot" class="">Slots</label
                ><input
                  name="slot"
                  id="formSlot"
                  placeholder="0"
                  type="text"
                  class="form-control"
                  v-model="form.slot"
                  disabled
                />
              </div>
            </div>

            <div class="col-md-3">
              <div class="position-relative form-group">
                <label for="labelFormLocations" class="">Localização</label>
                <select
                  name="location"
                  id="formLocations"
                  class="form-control"
                  v-model="form.location"
                >
                  <option value="">&nbsp;</option>
                  <option
                    v-for="location in locations"
                    :key="location.id"
                    :value="location.id"
                    >{{ location.name }}</option
                  >
                </select>
              </div>
            </div>

            <div class="col-md-4" v-if="machine.type_id == 1">
              <div class="position-relative form-group">
                <label for="labelFormLocations" class="">Aposta</label>
                <money
                  class="form-control"
                  v-model="form.bet"
                  v-bind="money"
                  :class="{ 'is-invalid': invalidBet }"
                  :disabled="user.role.level >= 3"
                ></money>
                <div class="invalid-feedback">
                  <ul>
                    <li v-for="msg in invalidBetMessage" :key="msg">
                      {{ msg }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="col-md-4">
              <div class="position-relative form-group">
                <label for="labelFormRent" class="">Aluguel</label>
                <money
                  class="form-control"
                  v-model="form.fixed_value"
                  v-bind="money"
                  :class="{ 'is-invalid': invalidFixedValue }"
                  :disabled="user.role.level >= 3"
                ></money>
                <div class="invalid-feedback">
                  <ul>
                    <li v-for="msg in invalidFixedValueMessage" :key="msg">
                      {{ msg }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="col-md-4">
              <div class="position-relative form-group">
                <label for="labelFormNetValue" class="">% do Liquido</label>
                <input
                  name="netValue"
                  id="formNetValue"
                  type="number"
                  step="0.01"
                  class="form-control"
                  v-model="form.net_value"
                  :class="{ 'is-invalid': invalidNetValue }"
                  :disabled="user.role.level >= 3"
                />
                <div class="invalid-feedback">
                  <ul>
                    <li v-for="msg in invalidNetValueMessage" :key="msg">
                      {{ msg }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="col-md-4">
              <div class="position-relative form-group">
                <label for="labelFormGrossValue" class="">% do Bruto</label>
                <input
                  name="grossValue"
                  id="formGrossValue"
                  type="number"
                  step="0.01"
                  class="form-control"
                  v-model="form.gross_value"
                  :class="{ 'is-invalid': invalidGrossValue }"
                  :disabled="user.role.level >= 3"
                />
                <div class="invalid-feedback">
                  <ul>
                    <li v-for="msg in invalidGrossValueMessage" :key="msg">
                      {{ msg }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div class="alert alert-warning" role="alert" v-if="operatorLocation">
            <font-awesome-icon
              icon="exclamation-triangle"
              size="2x"
              class="text-warning"
            />
            Verifique a lista de Operadores, a Localização selecionada não está
            vinculada a nenhum dos operadores da lista.
          </div>

          <button class="mt-2 btn btn-primary" @click.stop="onSubmit">
            Salvar
          </button>

          <button class="mt-2 btn btn-warning" @click.stop="onCancel">
            Retornar
          </button>
        </form>
      </div>
    </div>
    <machine-inventory v-if="machine" :machine="machine" />
    <machine-partner v-if="machine && user.role.level < 3" :machine="machine" />
    <machine-operator
      v-if="machine && user.role.level < 3"
      :machine="machine"
    />
  </div>
</template>

<script>
import axios from "axios";
import MachinePartner from "./MachinePartnerForm.vue";
import MachineInventory from "./MachineInventoryForm.vue";
import MachineOperator from "./MachineOperatorForm.vue";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
library.add(faExclamationTriangle);
import { mapGetters } from "vuex";

export default {
  components: {
    MachinePartner,
    MachineInventory,
    MachineOperator,
    FontAwesomeIcon,
  },
  name: "Machine_Form",
  data() {
    return {
      devices: [],
      types: [],
      samples: [],
      locations: [],
      form: {
        id: null,
        name: "",
        serial: "",
        device: null,
        type: null,
        sample: null,
        partners: [],
        operators: [],
        location: null,
        slot: 0,
        bet: 0,
        fixed_value: 0,
        net_value: 0,
        gross_value: 0,
      },
      error: [],
      invalidSerialMessage: null,
      invalidTypeMessage: null,
      invalidSampleMessage: null,
      invalidBetMessage: null,
      invalidFixedValueMessage: null,
      invalidNetValueMessage: null,
      invalidGrossValueMessage: null,

      money: {
        decimal: ",",
        thousands: ".",
        prefix: "R$ ",
        precision: 2,
        masked: false,
      },
    };
  },
  props: {
    machine: Object,
    showForm: Boolean,
    errorMessage: String,
    countdown: Number,
  },
  methods: {
    onSubmit() {
      const token = localStorage.getItem("token");

      let method = "POST";
      let userId = "";
      if (this.form.id) {
        method = "PUT";
        userId = this.form.id;
      }

      var Options = {
        method: method,
        url: "/api/machine/" + userId,
        data: this.form,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      axios(Options)
        .then(() => {
          this.$emit("updateDataTable", true);
          this.error = [];
          if (method == 'POST') this.$router.go(-1);
        })
        .catch((msg) => {
          if (msg.response.status == 422) {
            this.$emit("updateDataTable", false);
            this.error = msg.response.data.errors;

            if (this.error["serial"])
              this.invalidSerialMessage = this.error["serial"];
            if (this.error["type"])
              this.invalidTypeMessage = this.error["type"];
            if (this.error["sample"])
              this.invalidSampleMessage = this.error["sample"];
            if (this.error["bet"]) this.invalidBetMessage = this.error["bet"];
            if (this.error["fixed_value"])
              this.invalidFixedValueMessage = this.error["fixed_value"];
            if (this.error["net_value"])
              this.invalidNetValueMessage = this.error["net_value"];
            if (this.error["gross_value"])
              this.invalidGrossValueMessage = this.error["gross_value"];
          } else {
            this.$emit("updateDataTable", false);
            this.$emit("update:errorMessage", msg.response.data);
            this.$emit("update:countdown", 10);
          }
        });
    },
    onCancel() {
      this.$router.go(-1);
    },
    updateSlot(event) {
      let sampleId = event.target.value;
      let selectedSample = this.samples.filter((sp) => {
        return sp.id == sampleId;
      });
      this.form.slot = selectedSample[0].slot;
    },
  },
  created() {
    const token = localStorage.getItem("token");
    var OptionsDevice = {
      method: "get",
      url: "/api/device/available",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios(OptionsDevice).then((response) => {
      this.devices = response.data;
      if (this.machine && this.machine.device)
        this.devices.push(this.machine.device);
    });

    var OptionsTypes = {
      method: "get",
      url: "/api/type/available",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios(OptionsTypes).then((response) => {
      this.types = response.data;
    });

    var OptionsSamples = {
      method: "get",
      url: "/api/sample/available",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios(OptionsSamples).then((response) => {
      this.samples = response.data;
    });

    var OptionsLocations = {
      method: "get",
      url: "/api/location/available",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios(OptionsLocations).then((response) => {
      this.locations = response.data;
    });

    if (this.machine) {
      this.form = {
        id: this.machine.id,
        name: this.machine.name,
        serial: this.machine.serial,
        device: this.machine.device_id,
        type: this.machine.type_id,
        sample: this.machine.sample_id,
        slot: this.machine.sample.slot,
        partners: this.machine.partners,
        location: this.machine.location_id,
        bet: this.machine.bet,
        fixed_value: this.machine.fixed_value,
        net_value: this.machine.net_value,
        gross_value: this.machine.gross_value,
      };
    }
  },
  computed: {
    invalidSerial() {
      if (this.error == undefined || this.error == null) return false;
      if (this.error["serial"]) return true;
      return false;
    },
    invalidType() {
      if (this.error == undefined || this.error == null) return false;
      if (this.error["type"]) return true;
      return false;
    },
    invalidSample() {
      if (this.error == undefined || this.error == null) return false;
      if (this.error["sample"]) return true;
      return false;
    },
    invalidBet() {
      if (this.error == undefined || this.error == null) return false;
      if (this.error["bet"]) return true;
      return false;
    },
    invalidFixedValue() {
      if (this.error == undefined || this.error == null) return false;
      if (this.error["fixed_value"]) return true;
      return false;
    },
    invalidNetValue() {
      if (this.error == undefined || this.error == null) return false;
      if (this.error["net_value"]) return true;
      return false;
    },
    invalidGrossValue() {
      if (this.error == undefined || this.error == null) return false;
      if (this.error["gross_value"]) return true;
      return false;
    },
    operatorLocation() {
      if (this.machine == null || !this.machine.location) return false;

      let checkOperatorLocation = this.machine.operators.find((op) => {
        return op.id == this.machine.location.operator_id;
      });
      return checkOperatorLocation == undefined;
    },
    ...mapGetters(["user"]),
  },
};
</script>

<style></style>
