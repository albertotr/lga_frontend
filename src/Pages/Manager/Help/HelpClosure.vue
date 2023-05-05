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
          <p>É listado <span class="destaque">todos</span> os fechamentos feitos pelo gerente em questão</p>
          <img src="../../../images/managerClosure00.png" width="90%" />
        </li>
        <li>
          <p>
            Se for clicado no fechamento, é aberto o <span class="destaque">detalhamento do fechamento</span>,
            mostrando todas as Transações do fechamento
          </p>
          <img src="../../../images/managerClosure01.png" width="90%" />
        </li>
        <li>
          <p>
            O gerente pode <span class="destaque">adicionar</span> um fechamento, clicando no botão verde
            Adicionar
          </p>
          <p>
            Ao clicar se abre uma tela, onde é necessário <span class="destaque">selecionar o operador</span>
            que deseja fazer o fechamento, e o sistema listará <span class="destaque">todas as
            transações</span> em aberto do Operador selecionado, e em cinza acima, um
            resumo de todas as transações abaixo listadas
          </p>
          <p>
            Depois de conferir as transações, clicando em <span class="destaque">salvar</span> é gerando um
            fechamento contendo todas as transações do Operador
          </p>
          <img src="../../../images/managerClosure02.png" width="90%" />
        </li>
      </ol>
    </div>
  </div>
</template>

<script>
import PageTitle from "../../../Layout/Components/PageTitle.vue";
export default {
  name: "HelpLocation",
  components: {
    PageTitle,
  },
  data() {
    return {
      heading: "Manual",
      subheading: "Manual de Fechamento de Transações.",
      icon: "book",
      showForm: true,
    };
  },
  watch: {
    showForm(value) {
      if (!value) this.$router.back();
    },
  },
};
</script>

<style>
.destaque {
  font-weight: bolder;
}
</style>