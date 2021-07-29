<template>
  <div class="content">
    <div class="main-card mb-3 card">
      <div class="card-body">
        <h5 class="card-title">Cadastro do Usuário</h5>
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
                  v-model="form.name"
                />
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
                  v-model="form.email"
                />
              </div>
            </div>
            <div class="col-md-6">
              <div class="position-relative form-group">
                <label for="labelFormRole" class="">Perfil</label>
                <select
                  name="role"
                  id="formRole"
                  class="form-control"
                  v-model="form.role"
                >
                  <option
                    v-for="role in roles"
                    :key="role.id"
                    :value="role.id"
                    >{{ role.name }}</option
                  >
                </select>
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
  name: "User_Form",
  data() {
    return {
      roles: [],
      form: {
        name: "",
        email: "",
        role: "",
      },
    };
  },
  props: {
    user: Object,
    showForm: Boolean,
  },
  methods: {
    onSubmit() {
      const token = localStorage.getItem("token");

      let method = 'POST';
      if(this.form.id) method = 'PUT';

      var Options = {
        method: method,
        url: "/api/users/",
        data: this.form,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      axios(Options)
        .then((response) => {
          this.$emit("updateDataTable", response.data);
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

    if (this.user) {
      this.form = {
        id: this.user.id,
        name: this.user.name,
        email: this.user.email,
        role: this.user.role.id,
      };
    }
  },
  watch: {
    user(value) {
      if (!value) {
        this.form = {
          name: "",
          email: "",
          role: "",
        };
      } else {
        this.form = {
          name: value.name,
          email: value.email,
          role: value.role.id,
        };
      }
    },
  },
};
</script>

<style></style>
