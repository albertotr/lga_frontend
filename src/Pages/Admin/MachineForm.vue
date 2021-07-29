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
                  v-model="form.serial"
                />
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
                  v-model="form.type"
                >
                  <option
                    v-for="type in types"
                    :key="type.id"
                    :value="type.id"
                    >{{ type.name }}</option
                  >
                </select>
              </div>
            </div>
            <div class="col-md-3">
              <div class="position-relative form-group">
                <label for="labelFormSample" class="">Modelo</label>
                <select
                  name="sample"
                  id="formSample"
                  class="form-control"
                  v-model="form.sample"
                >
                  <option
                    v-for="sample in samples"
                    :key="sample.id"
                    :value="sample.id"
                    >{{ sample.name }}</option
                  >
                </select>
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
export default {
  name: "Machine_Form",
  data() {
    return {
      devices: [],
      types:[],
      samples:[],
      form: {
        id: null,
        serial: "",
        device:null,
        type:null,
        sample:null,
        slot:0,
      },
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
        url: "/api/machines/" + userId,
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
        .catch(() => {
          this.$emit("updateDataTable", false);
        });
    },
    onCancel() {
      this.$emit("update:showForm", false);
    },
  },
  created() {
    const token = localStorage.getItem("token");
    var OptionsDevice = {
      method: "get",
      url: "/api/device/",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios(OptionsDevice).then((response) => {
      this.devices = response.data;
      this.devices.push(this.machine.device);
    });

    var OptionsTypes = {
      method: "get",
      url: "/api/type/",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios(OptionsTypes).then((response) => {
      this.types = response.data;
    });

    var OptionsSamples = {
      method: "get",
      url: "/api/sample/",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios(OptionsSamples).then((response) => {
      this.samples = response.data;
    });

    if (this.machine) {
      this.form = {
        id: this.machine.id,
        serial: this.machine.serial,
        device: this.machine.device_id,
        type: this.machine.type_id,
        sample: this.machine.sample_id,
        slot: this.machine.sample.slot
      };
    }
  },
};
</script>

<style></style>
