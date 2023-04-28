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
                <p>Selecione <span class="destaque">Maquinas</span> no menu lateral, e vai ser exibido a lista de maquinas, com as colunas do Serial, Tipo, Modelo, Qtd de Slots, Endereço mac, o Saldo total e o Saldo disponivel.</p>
                <p> Com o botão de Editar e Excluir a máquina</p>
            </li>
            <li>
                <p>Acima a direita na tela, você possui o botão de verde <span class="destaque">+ Adicionar</span>, que abre o formulário para adicionar um nova maquina no sistema</p>
                <p>Neste formulário é <span class="destaque">necessário</span> informar o Nome, Serial, Tipo, Modelo e data de inicio do aluguel, mas é indicado <span class="destaque">já selecionar a localização</span>, que já foi previamente adicionada</p>
                <img src="../../../images/machine01.png"/>
            </li>
            <li>
                <p>O botão de <span class="destaque">editar</span> abre o mesmo formulário de cadastro, mas com os dados já inseridos</p>
            </li>
            <li>
                <p>O botão de <span class="destaque">excluir</span>, a lixeira vermelha, irá excluir permanentemente o cadastro e desvincular a maquina do dispositivo, não mais exibindo a maquina do sistema</p>
                <img src="../../../images/machine04.png"/>
            </li>
            <li>
                <p>Depois de inserido a maquina no sistema, você pode editar a máquina e associar à ela o inventário, parceiro e operador</p>
                <img src="../../../images/machine02.png"/>
            </li>
            <li>
                <p>Associar o inventário significa que item será controlado nas mensagens enviadas para esta máquina, como exemplo vamos usar a maquina do tipo bolinha</p>
                <img src="../../../images/machine03.png"/>
                <p>Precionando o botão verde <span class="destaque">+ Adicionar item não listado</span>, é listado todos os itens possiveis no inventário, para as maquinas de bolinha, se seleciona os tipos Bolina #1 até Bolinha #5</p>
                <p>E esse processo é repetido, até que todos os itens de inventário da maquina sejam cadastrados</p>
            </li>
            <li>
                <p>Associar um parceiro, significa apenas que esse parceiro, será incluido no rateio dos valores recebidos por esta maquina, e nesta associação, também é pedido o percentual de rateio que este parceiro tem direito</p>
                <img src="../../../images/machine05.png"/>
            </li>
            <li>
                <p>Associar o operador, irá proporcionar ao operador selecionado, o acesso as funções pertinentes ao controle da maquina, e também é informado o percentual de comição esse operador irá receber.</p>
                <img src="../../../images/machine06.png"/>
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
      subheading: "Manual de cadastro de Maquinas.",
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