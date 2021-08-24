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
                  v-model="form.mac"
                  :mask="['XX-XX-XX-XX-XX-XX']"
                  masked
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
  components: {},
  name: "Device_Form",
  data() {
    return {
      form: {
        id: null,
        mac: "",
      },
    };
  },
  props: {
    device: Object,
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
        url: "/api/device/" + userId,
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
        });
    },
    onCancel() {
      this.$emit("update:showForm", false);
    },
  },
  created() {
    if (this.device) {
      this.form = {
        id: this.device.id,
        mac: this.device.mac,
      };
    }
  },
  computed: {},
};
</script>

<style></style>
