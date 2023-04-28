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
                <p>O sistema lista as <span class="destaque">Mensagens recebidas</span> pela api, a cima você possui um dropdown, onde você pode selecionar o número de mensagens a serem listadas.</p>
            </li>
            <li>
                <p>Essas mensagens estão em um formato puro, como o sistema recebeu elas. Informando a data e hora de recebimento, endereço mac vinculado a mensagem e o tipo (ex: 08/02/2023, 17:47:49 1E-30-66-00-00-03 DAT)</p>
            </li>
            <li>
                <p>As mensagens em <span class="destaque">PRETO</span> são mensagens onde existe um dispositivo cadastrado, indicando que a mensagem foi vinculada a um dispositivo. As mensagens em <span class="destaque">LARANJA</span>, são mensagens onde não existia dispositivo com o endereço mac cadastrado, quando foi recebida a mensagens.</p>
                <img src="../../../images/message01.png" width="100%"/>
            </li>
            
        </ol>
    </div>
  </div>
</template>

<script>
import PageTitle from "../../../Layout/Components/PageTitle.vue";
export default {
  name: "HelpMessage",
  components: {
    PageTitle,
  },
  data() {
    return {
      heading: "Manual",
      subheading: "Manual de exibição de mensagens.",
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
</style>