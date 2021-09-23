<template>
  <div class="content">
    
    <div class="main-card mb-3 card">
      <div class="card-body">
        <h5 class="card-title">
          Inventario
        </h5>
        <b-table
          :items="machine.inventory.items"
          :fields="fields"
          striped
          bordered
          hover
          :busy="loadingTableResult"
          responsive="sm"
        >
        </b-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MachineInventory",
  components: {},
  props: {
    machine: Object,
  },
  data() {
    return {
      fields: [
        { key: "name", label: "Nome" },
        { key: "pivot.quantity", label:"estoque"},   
        { key: "action", label: "Ações" },
      ],
    };
  },
  computed: {
    loadingTableResult() {
      return this.machine == null;
    },
  },
  methods: {
    
  },
};
</script>

<style></style>
