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
      @updateDataTable="reloadDataTable"
      v-if="location"
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
    reloadDataTable(value) {
      console.info(value);
    },
  },
  created() {
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
};
</script>

<style></style>
