<template>
  <div>
    <machines-status />
    <machines-list/>
    <transactions-list />
  </div>
</template>

<script>
import MachinesStatus from "./gadget/MachinesStatus.vue";
import TransactionsList from "./gadget/TransactionsList.vue";
import MachinesList from "./gadget/MachinesList.vue";
export default {
  components: {
    MachinesStatus,
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
