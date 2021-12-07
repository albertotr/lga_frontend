<template>
  <div class="content">
    <div class="main-card mb-3 card">
      <div class="card-body">
        <h5 class="card-title">
          <span v-if="form.id == null">Cadastro</span
          ><span v-else>Editção</span> do Usuário
        </h5>
        <form class="" @submit.prevent>
          <div class="form-row">
            <div class="col-md-6">
              <div class="position-relative form-group">
                <label for="labelFormName" class="">Nome</label
                ><input
                  name="name"
                  id="formName"
                  placeholder="Digite o nome do usuário"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': invalidName }"
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
            <div class="col-md-6">
              <div class="position-relative form-group">
                <label for="labelFormEmail" class="">E-mail</label
                ><input
                  name="email"
                  id="formEmail"
                  placeholder="joaosilva@email.com.br"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': invalidEmail }"
                  v-model="form.email"
                />
                <div class="invalid-feedback">
                  <ul>
                    <li v-for="msg in invalidEmailMessage" :key="msg">
                      {{ msg }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="position-relative form-group">
                <label for="labelFormRole" class="">Perfil</label>
                <select
                  name="role"
                  id="formRole"
                  class="form-control"
                  :class="{ 'is-invalid': invalidRole }"
                  v-model="form.role"
                >
                  <option
                    v-for="role in roles"
                    :key="role.id"
                    :value="role.id"
                    >{{ role.name }}</option
                  >
                </select>
                <div class="invalid-feedback">
                  <ul>
                    <li v-for="msg in invalidRoleMessage" :key="msg">
                      {{ msg }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="col-md-6" v-if="form.operator">
              <div class="position-relative form-group">
                <label for="labelFormOperator" class="">Operador</label
                ><input
                  name="operator"
                  id="formOperator"
                  type="text"
                  class="form-control"
                  v-model="form.operator.name"
                  disabled
                />
              </div>
            </div>
          </div>

          <div class="text-center text-danger my-2" v-if="recording">
            <b-spinner class="align-middle"></b-spinner>
            <strong>Carregando...</strong>
          </div>

          <template v-else>
            <button class="mt-2 btn btn-primary" @click.stop="onSubmit">
              Salvar
            </button>

            <button class="mt-2 btn btn-warning" @click.stop="onCancel">
              Retornar
            </button>
          </template>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "User_Form",
  data() {
    return {
      roles: [],
      form: {
        id: null,
        name: "",
        email: "",
        role: "",
      },
      error: null,
      invalidNameMessage: "",
      invalidEmailMessage: "",
      invalidRoleMessage: "",
      recording: false,
    };
  },
  props: {
    showForm: Boolean,
  },
  methods: {
    onSubmit() {
      this.recording = true;
      const token = localStorage.getItem("token");

      let method = "POST";
      let userId = "";
      if (this.form.id) {
        method = "PUT";
        userId = this.form.id;
      }

      var Options = {
        method: method,
        url: "/api/user/" + userId,
        data: this.form,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      axios(Options)
        .then(() => {
          this.$router.go(-1);
        })
        .catch((msg) => {
          this.$emit("updateDataTable", false);
          if (msg.response.status == 422) {
            this.error = msg.response.data.errors;

            if (this.error["name"])
              this.invalidNameMessage = this.error["name"];
            if (this.error["email"])
              this.invalidEmailMessage = this.error["email"];
            if (this.error["role"])
              this.invalidRoleMessage = this.error["role"];
          }
          this.recording = false;
        });
    },
    onCancel() {
      this.$router.go(-1);
    },
  },
  created() {
    const token = localStorage.getItem("token");
    var Options = {
      method: "get",
      url: "/api/role/",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios(Options).then((response) => {
      this.roles = response.data;
    });

    if (this.$route.params.user) {
      Options = {
      method: "get",
      url: `/api/user/${this.$route.params.user}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios(Options).then((response) => {
      this.form = {
        id: response.data.id,
        name: response.data.name,
        email: response.data.email,
        role: response.data.role.id,
        operator: response.data.operator
      };
    });
    }
  },
  computed: {
    invalidName() {
      if (this.error == undefined || this.error == null) return false;
      if (this.error["name"]) return true;
      return false;
    },
    invalidEmail() {
      if (this.error == undefined || this.error == null) return false;
      if (this.error["email"]) return true;
      return false;
    },
    invalidRole() {
      if (this.error == undefined || this.error == null) return false;
      if (this.error["role"]) return true;
      return false;
    },
  },
};
</script>

<style></style>
