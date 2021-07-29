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
      roles: [],
      form: {
        id: null,
        serial: "",
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

    if (this.machine) {
      this.form = {
        id: this.machine.id,
        serial: this.machine.serial,
      };
    }
  },
};
</script>

<style></style>
