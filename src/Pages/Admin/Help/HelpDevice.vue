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
                <p>Selecione <span class="destaque">Dispositivos</span> no menu lateral, e vai ser exibido a lista de dispositivos e a máquina vinculada a ele.</p>
                <p> Com o botão de Editar e Excluir o dispositivo</p>
            </li>
            <li>
                <p>Acima a direita na tela, você possui o botão de verde <span class="destaque">+ Adicionar</span>, que abre o formulário para adicionar um novo dispositivo no sistema</p>
                <p>Neste formulário é necessário informar apenas o endereço MAC do dispositivo, inserindo apenas os números e letras do dispositivo</p>
                <img src="../../../images/device01.png"/>
            </li>
            <li>
                <p>O botão de <span class="destaque">editar</span> abre o mesmo formulário de cadastro, mas com o endereço MAC preenchido</p>
            </li>
            <li>
                <p>O botão de <span class="destaque">excluir</span>, a lixeira vermelha, irá excluir o cadastro de qualquer operação, não mais exibindo o dispositivo do sistema</p>
                <p>Mas isso <span class="destaque">não exclui</span> definitivamente o cadastro do sistema.</p>
                <p>Ao excluir o dispositivo, você pode restaurar, icone laranja de reciclagem, ou excluir ele permanentemente, icone de um <span class="destaque">explosivo vermelho</span>. A excluisão permanente só é possível, se este dispositivo não possier nenhum vinculo com algum outro objeto do sistema, como por exemplo, ser vinculado a uma maquina</p>
                <img src="../../../images/device02.png"/>
            </li>            
        </ol>
    </div>
  </div>
</template>

<script>
import PageTitle from "../../../Layout/Components/PageTitle.vue";
export default {
  name: "HelpDevice",
  components: {
    PageTitle,
  },
  data() {
    return {
      heading: "Manual",
      subheading: "Manual de cadastro de dispositivos.",
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