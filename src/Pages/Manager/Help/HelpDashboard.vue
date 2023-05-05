<template>
  <div>
    <page-title
      :heading="heading"
      :subheading="subheading"
      :icon="icon"
      :showForm.sync="showForm"
    ></page-title>
    <div class="content">
        <ol>
            <li>
                <p>A tela de Dashboard se <span class="destaque">limita</span> a dar um panorama geral das máquinas, mostrando todas as máquinas <span class="destaque">disponíveis</span> para o usuário e seus dados.</p>
                <img src="../../../images/dashboard01.png" width="30%"/>
            </li>
            
        </ol>
    </div>
  </div>
</template>

<script>
import PageTitle from "../../../Layout/Components/PageTitle.vue";
export default {
  name: "HelpDashboard",
  components: {
    PageTitle,
  },
  data() {
    return {
      heading: "Manual",
      subheading: "Manual da tela de Dashboard.",
      icon: "book",
      showForm: true,
    };
  },
  watch:{
    showForm(value){
        if(!value) this.$router.back();
    }
  }
};
</script>

<style>
.destaque{
  font-weight: bolder;
}
</style>