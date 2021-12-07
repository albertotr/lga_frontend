<template>
  <div>
    <b-alert
      :show="dismissCountDown"
      dismissible
      :variant="alertType"
      @dismissed="dismissCountDown = 0"
      @dismiss-count-down="countDownChanged"
    >
      <p>{{ alertMessage }}</p>
      <b-progress
        :variant="alertType"
        :max="dismissSecs"
        :value="dismissCountDown"
        height="4px"
      ></b-progress>
    </b-alert>
    <location-form
      :showForm.sync="showForm"
      :location="location"
      :errorMessage.sync="alertMessage"
      :countdown.sync="dismissCountDown"
      @updateDataTable="reloadDataTable"
    />
  </div>
</template>

<script>
import axios from "axios";
import LocationForm from "../../Admin/Location/LocationForm.vue";
export default {
  name: "LocationEdit",
  data() {
    return {
      heading: "Administração de Máquinas",
      subheading: "Verifique os dados antes de executar as ações.",
      dismissSecs: 10,
      dismissCountDown: 0,
      alertType: "success",
      alertMessage: "",
      showForm: true,
      token: null,
      location: null,
    };
  },
  components: {
    LocationForm,
  },
  methods: {
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown;
    },
    loadData(){
      this.token = localStorage.getItem("token");
      var Options = {
        method: "get",
        url: `/api/location/${this.$route.params.location}/`,
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      };
      axios(Options).then((response) => {
        this.location = response.data[0];
      });
    },
    reloadDataTable(value) {
      if (value || value === undefined) {
        this.loadData();
      } else if (value === false) {
        this.alertType = "warning";
        this.alertMessage = "Verifique o formulário";
        this.dismissCountDown = this.dismissSecs;
      }

      if (value) {
        this.alertType = "success";
        this.alertMessage = `Localização inserida/editada com sucesso.`;
        this.dismissCountDown = this.dismissSecs;
      }
    },
  },
  created() {
    if(this.location) this.loadData()
  },
};
</script>

<style></style>
