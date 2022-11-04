<template>
  <div>
    <page-title
      :heading="heading"
      :subheading="subheading"
      :icon="icon"
    ></page-title>
    <b-card-group deck class="d-flex justify-content-justify m-0">
      <change-password/>
    </b-card-group>
  </div>
</template>

<script>
import PageTitle from "../../Layout/Components/PageTitle.vue";
import ChangePassword from "./settings/ChangePassword.vue";
export default {
  name: "Settings",
  components: {
    PageTitle,
    ChangePassword,
  },
  data() {
    return {
      heading: "Configurações",
      subheading: "Configurações e Preferencias de Sistema e Usuário",
      icon: "pe-7s-config text-info",
    };
  },
};
</script>

<style scoped>

</style>
