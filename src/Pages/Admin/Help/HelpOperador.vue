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
                <p>Selecione <span class="destaque">Operador</span> no menu lateral, e vai ser exibido a lista de operadores com seu nome e o nome do seu gerente.</p>
                <p> Com o botão de Editar e Excluir o operador</p>
            </li>
            <li>
                <p>Acima a direita na tela, você possui o botão de verde <span class="destaque">+ Adicionar</span>, que abre o formulário para adicionar um novo operador no sistema</p>
                <p>Neste formulário é necessário informar o Nome e CPF. O restante dos dados é facultativo, e também indicar qual é o usuário deste Operador, assim toda ação feita pelo usuário autenticado, será creditada a este operador</p>
                <img src="../../../images/operador01.png"/>
            </li>
            <li>
                <p>O botão de <span class="destaque">editar</span> abre o mesmo formulário de cadastro, mas com os dados já inseridos</p>
            </li>
            <li>
                <p>O botão de <span class="destaque">excluir</span>, a lixeira vermelha, irá excluir o cadastro de qualquer operação, não mais exibindo o operador do sistema</p>
                <p>Mas isso <span class="destaque">não exclui</span> definitivamente o cadastro do sistema.</p>
                <p>Ao excluir o operador, você pode restaurar, icone laranja de reciclagem, o operador ou excluir ele permanentemente, icone de um <span class="destaque">explosivo vermelho</span>. A excluisão permanente só é possível, se este operador não possie nenhum vinculo com algum outro objeto do sistema, como por exemplo, ser vinculado a uma transação</p>
                <img src="../../../images/operador02.png"/>
            </li>
            <li>
              <p>Depois de cadastrado o <span class="destaque">Operador</span>, você pode vincular outros operadores a este operador <span class="destaque">'Gerente'</span>, isso indicará que este Gerente irá ter <span class="destaque">privilégios</span> acima destes operadores, e será exibido a este gerente todos os cadastros e maquinas vinculadas a estes operadores</p> 
              <img src="../../../images/operador03.png"/>
            </li>
        </ol>
    </div>
  </div>
</template>

<script>
import PageTitle from "../../../Layout/Components/PageTitle.vue";
export default {
  name: "HelpOperador",
  components: {
    PageTitle,
  },
  data() {
    return {
      heading: "Manual",
      subheading: "Manual de cadastro de operador.",
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