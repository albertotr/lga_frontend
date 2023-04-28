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
                <p>Selecione <span class="destaque">Usuario</span> no menu lateral, e vai ser exibido a lista de usuário que possuem acesso ao sistem, seu e-mail e um dos 3 perfís disponiveis.</p>
                <p> Com o botão de Editar e Excluir o usuário</p>
            </li>
            <li>
                <p>Acima a direita na tela, você possui o botão de verde <span class="destaque">+ Adicionar</span>, que abre o formulário para adicionar um novo usuário no sistema</p>
                <p>Neste formulário é necessário informar o Nome, e-mail e selecionar o perfil. O E-mail deve ser único no sistema</p>
                <img src="../../../images/user03.png"/>
            </li>
            <li>
                <p>O botão de <span class="destaque">editar</span> abre o mesmo formulário de cadastro, mas com os dados já inseridos</p>
            </li>
            <li>
                <p>O botão de <span class="destaque">excluir</span>, a lixeira vermelha, irá excluir o cadastro de qualquer operação, não mais exibindo o usuário do sistema</p>
                <p>Mas isso <span class="destaque">não exclui</span> definitivamente o cadastro do sistema.</p>
                <p>Ao excluir o usuario, você pode restaurar, icone laranja de reciclagem, o usuário ou excluir ele permanentemente, icone de um <span class="destaque">explosivo vermelho</span>. A excluisão permanente só é possível, se este usuário não possie nenhum vinculo com algum outro objeto do sistema, como por exemplo, ser vinculado a um operador</p>
                <img src="../../../images/user04.png"/>
            </li>
        </ol>
    </div>
  </div>
</template>

<script>
import PageTitle from "../../../Layout/Components/PageTitle.vue";
export default {
  name: "HelpUser",
  components: {
    PageTitle,
  },
  data() {
    return {
      heading: "Manual",
      subheading: "Manual de cadastro de usuário.",
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