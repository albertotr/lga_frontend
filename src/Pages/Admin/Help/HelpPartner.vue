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
                <p>Selecione <span class="destaque">parceiros</span> no menu lateral, e vai ser exibido a lista de parceiros, com seus respectivos operadores, e o botão de editar.</p>
            </li>
            <li>
                <p>Acima a direita na tela, você possui o botão de verde <span class="destaque">+ Adicionar</span>, que abre o formulário para adicionar uma nova parceiro no sistema</p>
                <p>Neste formulário é necessário informar o Nome, Logradouro, Número, Cidade, Estado e CPF/CNPJ.</p>
                <img src="../../../images/partner01.png"/>
            </li>
            <li>
                <p>O botão de <span class="destaque">editar</span> abre o mesmo formulário de cadastro, mas com os dados já inseridos</p>
            </li>
            <li>
                <p>O botão de <span class="destaque">excluir</span>, a lixeira vermelha, irá excluir o cadastro de qualquer operação, não mais exibindo a parceiro do sistema</p>
                <p>Mas isso <span class="destaque">não exclui</span> definitivamente o cadastro do sistema.</p>
                <p>Ao excluir a parceiro, você pode restaurar, icone laranja de reciclagem, ou excluir ela permanentemente, icone de um <span style="font-weight:bolder">explosivo vermelho</span>. A excluisão permanente só é possível, se esta parceiro não possie nenhum vinculo com algum outro objeto do sistema, como por exemplo, ser vinculado a uma maquina</p>
                <img src="../../../images/partner02.png"/>                
            </li>
        </ol>
    </div>
  </div>
</template>

<script>
import PageTitle from "../../../Layout/Components/PageTitle.vue";
export default {
  name: "HelpPartner",
  components: {
    PageTitle,
  },
  data() {
    return {
      heading: "Manual",
      subheading: "Manual de cadastro de Parceiro.",
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