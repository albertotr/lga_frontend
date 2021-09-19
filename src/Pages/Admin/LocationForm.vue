<template>
  <div class="content">
    <div class="main-card mb-3 card">
      <div class="card-body">
        <h5 class="card-title">
          <span v-if="form.id == null">Cadastro</span
          ><span v-else>Editção</span> de Localização
        </h5>
        <form class="" @submit.prevent>
          <div class="form-row">
            <div class="col-md-6">
              <div class="position-relative form-group">
                <label for="labelFormName" class="">Nome</label
                ><input
                  name="name"
                  id="formName"
                  type="text"
                  :class="{ 'is-invalid': invalidName }"
                  class="form-control"
                  v-model="form.name"
                />
                <div class="invalid-feedback">
                  <ul>
                    <li v-for="msg in invalidNameMessage" :key="msg">
                      {{ msg }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="col-md-8">
              <div class="position-relative form-group">
                <label for="labelFormAddress" class="">Logradouro</label
                ><input
                  name="address"
                  id="formAddress"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': invalidAddress }"
                  v-model="form.address"
                />
                <div class="invalid-feedback">
                  <ul>
                    <li v-for="msg in invalidNumberMessage" :key="msg">
                      {{ msg }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="position-relative form-group">
                <label for="labelFormNumber" class="">Numero</label
                ><input
                  name="number"
                  id="formNumber"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': invalidNumber }"
                  v-model="form.number"
                />
                <div class="invalid-feedback">
                  <ul>
                    <li v-for="msg in invalidNumberMessage" :key="msg">
                      {{ msg }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="col-md-6">
              <div class="position-relative form-group">
                <label for="labelFormComplement" class="">Complemento</label
                ><input
                  name="complement"
                  id="formComplement"
                  type="text"
                  class="form-control"
                  v-model="form.complement"
                />
              </div>
            </div>
            <div class="col-md-6">
              <div class="position-relative form-group">
                <label for="labelFormNeighborhood" class="">Bairro</label
                ><input
                  name="number"
                  id="formNeighborhood"
                  type="text"
                  class="form-control"
                  v-model="form.neighborhood"
                />
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="col-md-6">
              <div class="position-relative form-group">
                <label for="labelFormCity" class="">Cidade</label
                ><input
                  name="city"
                  id="formCity"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': invalidCity }"
                  v-model="form.city"
                />
                <div class="invalid-feedback">
                  <ul>
                    <li v-for="msg in invalidCityMessage" :key="msg">
                      {{ msg }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="position-relative form-group">
                <label for="labelFormState" class="">Estado</label
                ><input
                  name="state"
                  id="formState"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': invalidState }"
                  v-model="form.state"
                />
                <div class="invalid-feedback">
                  <ul>
                    <li v-for="msg in invalidStateMessage" :key="msg">
                      {{ msg }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="col-md-6">
              <div class="position-relative form-group">
                <label for="labelFormOperator" class="">Operador</label>
                <select
                  name="operator"
                  id="formOperator"
                  class="form-control"
                  :class="{ 'is-invalid': invalidOperatorId }"
                  v-model="form.operator_id"
                >
                  <option value="null">&nbsp;</option>
                  <option
                    v-for="operator in operators"
                    :key="operator.id"
                    :value="operator.id"
                    >{{ operator.name }}</option
                  >
                </select>
                <div class="invalid-feedback">
                  <ul>
                    <li v-for="msg in invalidOperatorIdMessage" :key="msg">
                      {{ msg }}
                    </li>
                  </ul>
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
export default {
  components: {},
  name: "Location_Form",
  data() {
    return {
      operators: [],
      form: {
        id: null,
        name: "",
        address: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: "",
        postalcode: "",
        location_id: "",
      },
      error: null,
      invalidNameMessage: "",
      invalidNumberMessage: "",
      invalidAddressMessage: "",
      invalidCityMessage: "",
      invalidStateMessage: "",
      invalidOperatorIdMessage: "123",
    };
  },
  props: {
    location: Object,
    showForm: Boolean,
  },
  methods: {
    onSubmit() {
      const token = localStorage.getItem("token");

      let method = "POST";
      let id = "";
      if (this.form.id) {
        method = "PUT";
        id = this.form.id;
      }

      var Options = {
        method: method,
        url: "/api/location/" + id,
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
          this.$emit("updateDataTable", msg.response);
          if (msg.response.status == 422) {
            this.error = msg.response.data.errors;

            if (this.error["name"])
              this.invalidNameMessage = this.error["name"];
            if (this.error["number"])
              this.invalidNumberMessage = this.error["number"];
            if (this.error["address"])
              this.invalidAddressMessage = this.error["address"];
            if (this.error["city"])
              this.invalidCityMessage = this.error["city"];
            if (this.error["state"])
              this.invalidStateMessage = this.error["state"];
            if (this.error["operator_id"])
              this.invalidOperatorIdMessage = this.error["operator_id"];
          }
        });
    },
    onCancel() {
      this.$emit("update:showForm", false);
    },
  },
  created() {
    const token = localStorage.getItem("token");
    var OptionsOperators = {
      method: "get",
      url: "/api/operator/available",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios(OptionsOperators).then((response) => {
      this.operators = response.data;
      if (this.machine && this.machine.operator)
        this.operators.push(this.machine.operator);
    });

    if (this.location) {
      this.form = {
        id: this.location.id,
        name: this.location.name,
        address: this.location.address,
        number: this.location.number,
        complement: this.location.complement,
        neighborhood: this.location.neighborhood,
        city: this.location.city,
        state: this.location.state,
        postalcode: this.location.postal_code,
        operator_id: this.location.operator_id,
      };
    }
  },
  computed: {
    invalidName() {
      if (this.error == undefined || this.error == null) return false;
      if (this.error["name"]) return true;
      return false;
    },
    invalidNumber() {
      if (this.error == undefined || this.error == null) return false;
      if (this.error["number"]) return true;
      return false;
    },
    invalidAddress() {
      if (this.error == undefined || this.error == null) return false;
      if (this.error["address"]) return true;
      return false;
    },
    invalidCity() {
      if (this.error == undefined || this.error == null) return false;
      if (this.error["city"]) return true;
      return false;
    },
    invalidState() {
      if (this.error == undefined || this.error == null) return false;
      if (this.error["state"]) return true;
      return false;
    },
    invalidOperatorId() {
      if (this.error == undefined || this.error == null) return false;
      if (this.error["operator_id"]) return true;
      return false;
    },
  },
};
</script>

<style></style>
