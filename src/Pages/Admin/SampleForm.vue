<template>
  <div class="content">
    <div class="main-card mb-3 card">
      <div class="card-body">
        <h5 class="card-title">
          <span v-if="form.id == null">Cadastro</span
          ><span v-else>Editção</span> de Modelos
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
                  class="form-control"
                  v-model="form.name"
                />
              </div>
            </div>
            <div class="col-md-6">
              <div class="position-relative form-group">
                <label for="labelFormSlot" class="">Slots</label
                ><input
                  name="name"
                  id="formSlot"
                  type="number"
                  class="form-control"
                  v-model.number="form.slot"
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
  name: "Sample_Form",
  data() {
    return {
      form: {
        id: null,
        name: "",
        slot: 0,
      },
    };
  },
  props: {
    sample: Object,
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
        url: "/api/sample/" + id,
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
    if (this.sample) {
      this.form = {
        id: this.sample.id,
        name: this.sample.name,
        slot: this.sample.slot
      };
    }
  },
  computed: {},
};
</script>

<style></style>
