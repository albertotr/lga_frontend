<template>
  <span>{{ formated | format }}</span>
</template>

<script>
export default {
  name: "cpf_cnpj",
  data() {
    return {
      formated: this.value,
    };
  },
  props: {
    value: {
      type: String,
      default: "",
    },
  },
  filters: {
    format: function(value) {
      //retira os caracteres indesejados...
      let cpf = value.replace(/[^\d]/g, "");

      //realizar a formatação...
      return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    },
  },
};
</script>

<style lang="scss" scoped></style>
