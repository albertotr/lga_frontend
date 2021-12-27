<template>
  <div class="content">
    <div class="main-card mb-3 card">
      <div class="card-body">
        <h5 class="card-title">
          <span v-if="form.id == null">Cadastro</span
          ><span v-else>Editção</span> de Operador
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
            <div class="col-md-4">
              <div class="position-relative form-group">
                <label for="labelFormPostalCode" class="">CEP</label
                ><the-mask
                  name="postalcode"
                  id="formPostalCode"
                  type="text"
                  class="form-control"
                  v-model="form.postalcode"
                  :mask="['#####-###']"
                />
              </div>
            </div>
            <div class="col-md-4">
              <div class="position-relative form-group">
                <label for="labelFormCpfCnpj" class="">Cpf/Cnpj</label
                ><the-mask
                  name="cpfcnpj"
                  id="formCpfCnpj"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': invalidCpfCnpj }"
                  v-model="form.cpfcnpj"
                  :mask="['###.###.###-##', '##.###.###/####-##']"
                />
                <div class="invalid-feedback">
                  <ul>
                    <li v-for="msg in invalidCpfCnpjMessage" :key="msg">
                      {{ msg }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="position-relative form-group">
                <label for="labelFormUser" class="">Usuario</label>
                <select
                  name="user"
                  id="formUser"
                  class="form-control"
                  v-model="form.user_id"
                >
                  <option value="null">&nbsp;</option>
                  <option
                    v-for="user in users"
                    :key="user.id"
                    :value="user.id"
                    >{{ user.name }}</option
                  >
                </select>
              </div>
            </div>
          </div>

          <button class="mt-2 btn btn-primary" @click.stop="onSubmit">
            Salvar
          </button>

          <button class="mt-2 btn btn-warning" @click.stop="$router.go(-1)">
            Retornar
          </button>
        </form>
      </div>
    </div>
    <contributor v-if="operator" :manager="operator" />
  </div>
</template>

<script>
import axios from "axios";
import Contributor from "./Contributor.vue";
export default {
  components: {
    Contributor,
  },
  name: "Operator_Form",
  data() {
    return {
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
        cpfcnpj: "",
        user_id: "",
        user:[],
      },
      error: null,
      invalidNameMessage: "",
      invalidNumberMessage: "",
      invalidAddressMessage: "",
      invalidCityMessage: "",
      invalidStateMessage: "",
      invalidCpfCnpjMessage: "",
      users: [],
      token: null,
      operator: null,
    };
  },
  methods: {
    onSubmit() {
      let method = "POST";
      let id = "";
      if (this.form.id) {
        method = "PUT";
        id = this.form.id;
      }

      var Options = {
        method: method,
        url: "/api/operator/" + id,
        data: this.form,
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      };
      axios(Options)
        .then(() => {
          this.$router.go(-1);
        })
        .catch((msg) => {
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
            if (this.error["cpfcnpj"])
              this.invalidCpfCnpjMessage = this.error["cpfcnpj"];
          }
        });
    },
  },
  created() {
    this.token = localStorage.getItem("token");

    if (this.$route.params.operator) {
      const token = localStorage.getItem("token");
      var Options = {
        method: "get",
        url: `/api/operator/${this.$route.params.operator}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      axios(Options).then((response) => {
        this.operator = response.data;
        this.form = {
          id: response.data.id,
          name: response.data.name,
          address: response.data.address,
          number: response.data.number,
          complement: response.data.complement,
          neighborhood: response.data.neighborhood,
          city: response.data.city,
          state: response.data.state,
          postalcode: response.data.postal_code,
          cpfcnpj: response.data.cpf_cnpj,
          user_id: response.data.user_id,
          user:response.data.user,
        };
      });
    }

    Options = {
      method: "GET",
      url: "/api/operator/user",
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    };
    axios(Options).then((response) => {
      this.users = response.data;
      if (this.operator && this.operator.user)
        this.users.push(this.operator.user);
    });
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
    invalidCpfCnpj() {
      if (this.error == undefined || this.error == null) return false;
      if (this.error["cpfcnpj"]) return true;
      return false;
    },
  },
};
</script>

<style></style>
