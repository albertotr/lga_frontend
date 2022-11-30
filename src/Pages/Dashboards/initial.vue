<template>
  <div>
    <machines-list/>
    <transactions-list />
  </div>
</template>

<script>
import TransactionsList from "./gadget/TransactionsList.vue";
import MachinesList from "./gadget/MachinesList.vue";
export default {
  components: {
    TransactionsList,
    MachinesList,
  },
  name: "initial",
  data() {
    return {};
  },
  methods: {},
  created() {},
  computed: {},
};
</script>

<style scoped>
</style>
