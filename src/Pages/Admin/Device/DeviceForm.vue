<template>
  <div class="content">
    <div class="main-card mb-3 card">
      <div class="card-body">
        <h5 class="card-title">
          <span v-if="form.id == null">Cadastro</span
          ><span v-else>Editção</span> de Dispositios
        </h5>
        <form class="" @submit.prevent>
          <div class="form-row">
            <div class="col-md-6">
              <div class="position-relative form-group">
                <label for="labelFormName" class="">MAC</label
                ><the-mask
                  name="mac"
                  id="formMac"
                  type="text"
                  class="form-control text-uppercase"
                  :class="{ 'is-invalid': invalidMac }"
                  v-model="form.mac"
                  :mask="['XX-XX-XX-XX-XX-XX']"
                  masked
                />
                <div class="invalid-feedback">
                  <ul>
                    <li v-for="msg in invalidMacMessage" :key="msg">
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

          <button class="mt-2 btn btn-warning" @click.stop="$router.go(-1)">
            Retornar
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
  name: "Device_Form",
  data() {
    return {
      form: {
        id: null,
        mac: "",
      },
      invalidMacMessage: "",
      error: [],
    };
  },
  props: {},
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
        url: "/api/device/" + id,
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
          this.$emit("updateDataTable", msg.response);
          if (msg.response.status == 422) {
            this.error = msg.response.data.errors;

            if (this.error["mac"]) this.invalidMacMessage = this.error["mac"];
          }
        });
    },
  },
  created() {
    if (this.$route.params.device) {
      const token = localStorage.getItem("token");
      var Options = {
        method: "get",
        url: `/api/device/${this.$route.params.device}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      axios(Options).then((response) => {
        this.form = {
          id: response.data.id,
          mac: response.data.mac,
        };
      });
    }
  },
  computed: {
    invalidMac() {
      if (this.error == undefined || this.error == null) return false;
      if (this.error["mac"]) return true;
      return false;
    },
  },
};
</script>

<style></style>
