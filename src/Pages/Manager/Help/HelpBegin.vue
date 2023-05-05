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
                <p>A tela de inicio lista todas as máquinas <span class="destaque">disponíveis</span> para o Usuário</p>
                <img src="../../../images/begin01c.png"/>
            </li>
            <li>
                <p>Se você clicar em uma das máquinas, o sistema abre um pop-up, com o formulário para criar uma <span class="destaque">transação</span>, que seria o processo de <span class="destaque">retirar o dinheiro</span> da máquina (sangria).</p>
                <img src="../../../images/begin02.png"/>
            </li>
            <li>
              <p>No processo de retirada de dinheiro, você pode identificar que o estoque <span class="destaque">não confere</span>, ou o valor informado <span class="destaque">não é</span> o valor que está na máquina, com isso você pode <span class="destaque">editar o estoque</span>(imagens abaixo), e informar o valor que está sendo retirado, mas <span class="destaque">isso requer</span> que você deixe um comentário sobre a transação efetuada</p>
              <img src="../../../images/begin03.png" width="40%"/>&nbsp;<img src="../../../images/begin04.png" width="30%"/>
            </li>

            <li>
              <p>No final da página, é mostrado a lista de <span class="destaque">todas as transações</span> das máquinas, caso uma máquina tenha sido <span class="destaque">deletada</span>, as transações desta maquina <span class="destaque">não apareceram</span> nesta listagem</p>
              <img src="../../../images/begin05.png" width="100%"/>
            </li>    
            
        </ol>
    </div>
  </div>
</template>

<script>
import PageTitle from "../../../Layout/Components/PageTitle.vue";
export default {
  name: "HelpBegin",
  components: {
    PageTitle,
  },
  data() {
    return {
      heading: "Manual",
      subheading: "Manual da tela de Inicio.",
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