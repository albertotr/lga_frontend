<template>
  <div>
    <page-title
      :heading="heading"
      :subheading="subheading"
      :icon="icon"
    ></page-title>

    <div class="content">
      conteudo do usuario
    </div>
  </div>
</template>

<script>
import PageTitle from "../../Layout/Components/user/PageTitle.vue";
export default {
  name: "Users",
  components: {
    PageTitle,
  },
  data() {
    return {
      heading: "Administração de Usuários",
      subheading:
        "Verifique os dados antes de executar as ações.",
      icon: "fa-users text-success",
    };
  },
};
</script>

<style></style>
