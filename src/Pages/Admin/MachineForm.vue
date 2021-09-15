<template>
  <div class="content">
    <div class="main-card mb-3 card">
      <div class="card-body">
        <h5 class="card-title">
          <span v-if="form.id == null">Cadastro</span
          ><span v-else>Editção</span> de Maquinas
        </h5>
        <form class="" @submit.prevent>
          <div class="form-row">
            <div class="col-md-6">
              <div class="position-relative form-group">
                <label for="labelFormName" class="">Serial</label
                ><input
                  name="serial"
                  id="formSerial"
                  placeholder="Digite o serial da máquina"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': invalidSerial }"
                  v-model="form.serial"
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
            <div class="col-md-3">
              <div class="position-relative form-group">
                <label for="labelFormType" class="">Tipo</label>
                <select
                  name="type"
                  id="formType"
                  class="form-control"
                  :class="{ 'is-invalid': invalidType }"
                  v-model="form.type"
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
            <div class="col-md-12" v-if="selectedPartner">
              <div class="position-relative form-group">
                <div class="card">
                  <div class="card-body">
                    <h5 class="card-title">{{ selectedPartner.name }}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">
                      CPF/CNPJ:&nbsp;<cpfcnpj
                        :value="selectedPartner.cpf_cnpj"
                      />
                    </h6>
                    <p class="card-text">
                      Endereço:&nbsp;{{ selectedPartner.address }},&nbsp;{{
                        selectedPartner.number
                      }},&nbsp;{{ selectedPartner.neigborhood }},&nbsp;{{
                        selectedPartner.city
                      }},&nbsp;
                      {{ selectedPartner.state }}
                      <br />
                      Complemento:&nbsp;{{ selectedPartner.complement }}
                      <br />
                      CEP:{{ selectedPartner.postal_code }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button class="mt-2 btn btn-primary" @click.stop="onSubmit">
            Salvar
          </button>

          <button class="mt-2 btn btn-danger" @click.stop="onCancel">
            Cancelar
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import cpfcnpj from "../Components/CpfCnpj.vue";
export default {
  components: { cpfcnpj },
  name: "Machine_Form",
  data() {
    return {
      devices: [],
      types: [],
      samples: [],
      partners: [],
      form: {
        id: null,
        serial: "",
        device: null,
        type: null,
        sample: null,
        partner: null,
        slot: 0,
      },
      error: [],
      invalidSerialMessage: null,
      invalidTypeMessage: null,
      invalidSampleMessage: null,
    };
  },
  props: {
    machine: Object,
    showForm: Boolean,
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
          this.$emit("update:showForm", false);
        })
        .catch((msg) => {
          this.$emit("updateDataTable", false);
          if (msg.response.status == 422) {
            this.error = msg.response.data.errors;

            if (this.error["serial"])
              this.invalidSerialMessage = this.error["serial"];
            if (this.error["type"])
              this.invalidTypeMessage = this.error["type"];
            if (this.error["sample"])
              this.invalidSampleMessage = this.error["sample"];
          }
        });
    },
    onCancel() {
      this.$emit("update:showForm", false);
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

    var OptionsPartner = {
      method: "get",
      url: "/api/partner/available",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios(OptionsPartner).then((response) => {
      this.partners = response.data;
    });

    if (this.machine) {
      this.form = {
        id: this.machine.id,
        serial: this.machine.serial,
        device: this.machine.device_id,
        type: this.machine.type_id,
        sample: this.machine.sample_id,
        slot: this.machine.sample.slot,
        partner: this.machine.partner_id,
      };
    }
  },
  computed: {
    selectedPartner() {
      if (this.form.partner == null || this.partners == null) return null;

      if (this.partners != null && this.form.partner != null) {
        let part = this.partners.filter((partner) => {
          return partner.id == this.form.partner;
        });
        return part[0];
      }

      return null;
    },
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
  },
};
</script>

<style></style>
