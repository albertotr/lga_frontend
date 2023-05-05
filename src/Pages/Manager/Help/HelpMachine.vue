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
          <p>
            Nesta tela é listada todas as máquina gerenciadas, o botão verde
            mostra a data/hora da ultima atulização, pressionando ele se
            atualiza as informações da listagem
          </p>
          <p>
            Os botões <span class="destaque">Todas/Online/Offline</span> filtra
            as maquinas a serem exibidas
          </p>
          <p>
            Os botões <span class="destaque">Serial e Nome</span> ordenam as
            maquinas
          </p>
          <p>O listbox com o numero, é o numero de maquinas a serem listadas</p>
          <img src="../../../images/managerMachine00.png" width="80%" />
        </li>
        <li>
          <p>Cada linha da listagem mostra uma máquina, seu <span class="destaque">Nome e Localização</span>, e todos os totais a baixo</p>
          <p>No final da linha a direita, se tem os botões de Menssagens, Transação (criar), Transações (listagem), Edição</p>
          <img src="../../../images/managerMachine01.png" width="80%" />
        </li>
        <li>
          <p>E os dados da máquina, só é permitido a alteração da <span class="destaque">Localização</span> da mesma</p>
          <p>Na edição da máquina, se tem a <span class="destaque">lista de inventário</span>, onde se pode adicionar ou retirar itens do inventário</p>
          <img src="../../../images/managerMachine02.png" width="80%">
        </li>
      </ol>

    </div>
  </div>
</template>

<script>
import PageTitle from "../../../Layout/Components/PageTitle.vue";
export default {
  name: "HelpMachine",
  components: {
    PageTitle,
  },
  data() {
    return {
      heading: "Manual",
      subheading: "Manual de Gerencia de Maquinas.",
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