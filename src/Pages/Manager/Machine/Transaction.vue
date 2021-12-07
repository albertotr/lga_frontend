<template>
  <div>
    <div class="row" v-if="machine">
      <b-col sm="6">
        <label class="">Maquina:&nbsp;</label
        ><span>{{ this.machine.serial }}</span>
      </b-col>
      <b-col sm="6">
        <label class="">MAC:&nbsp;</label
        ><span>{{ this.machine.device.mac }}</span>
      </b-col>

      <b-col sm="4">
        <label class="">Saldo Bruto:&nbsp;</label
        ><span>{{ this.machine.total_balance | currency }}</span>
      </b-col>
      <b-col sm="4">
        <label class="">Saldo:&nbsp;</label
        ><span>{{ this.machine.balance | currency }}</span>
      </b-col>
      <b-col sm="4">
        <label class="">Custo:&nbsp;</label
        ><span>{{ this.machine.cost | currency }}</span>
      </b-col>

      <b-col sm="12">
        <b-row>
          <b-col>
            <label class="">Estoque esperado:&nbsp;</label
            ><span>{{ this.totalInventory }}</span>
          </b-col>
          <b-col
            ><button
              class="btn btn-sm btn-primary"
              v-b-modal.inventoryModal
            >
              Editar Estoque
            </button></b-col
          >
        </b-row>
      </b-col>

      <b-col sm="12">
        <br />
        <div class="position-relative form-group">
          <label for="labelFormMoney" class="">Valor do saque</label>
          <money
            class="form-control"
            v-model="value"
            v-bind="money"
            :class="{ 'is-invalid': invalidValue }"
          ></money>
          <div class="invalid-feedback">
            <ul>
              <li v-for="msg in invalidValueMessage" :key="msg">
                {{ msg }}
              </li>
            </ul>
          </div>
        </div>
      </b-col>

      <b-col sm="12">
        <div class="position-relative form-group">
          <label for="labelFormCode" class="">Comentario</label
          ><b-form-textarea
            id="textarea"
            v-model="comment"
            placeholder="Comentarios..."
            rows="3"
            max-rows="6"
          ></b-form-textarea>
        </div>
      </b-col>

      <b-col sm="6">
        <b-form-checkbox v-model="match" checked
          >Valores correspondem ao real</b-form-checkbox
        >
      </b-col>

      <b-col sm="6">
        <b-form-checkbox v-model="zeroBalance" checked
          >Zerar saldo</b-form-checkbox
        >
      </b-col>
    </div>

    <div class="w-100">
      <b-button-group>
        <button class="btn btn-primary" @click.stop="onTransactionCreate">
          Sacar
        </button>
        <button
          class="btn btn-danger"
          @click.stop="$bvModal.hide('transactionModal')"
        >
          Cancelar
        </button>
      </b-button-group>
    </div>

    <b-modal
      id="inventoryModal"
      v-if="machine"
      size="xl"
      :title="`Edição Inventario Maquina ${machine.serial}`"
      hide-footer
    >
      <machine-inventory :machine="machine" />
    </b-modal>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";
import MachineInventory from "../../Admin/Machine/MachineInventoryForm.vue";
export default {
  name: "transaction",
  data() {
    return {
      money: {
        decimal: ",",
        thousands: ".",
        prefix: "R$ ",
        precision: 2,
        masked: false,
      },
      value: 0,
      comment: "",
      match: true,
      zeroBalance: true,
      invalidValue: false,
      invalidValueMessage: 0,

      objeto: null,
    };
  },
  components: {
    MachineInventory,
  },
  props: {
    machine: Object,
  },
  computed: {
    ...mapGetters(["permissions"]),
    totalInventory() {
      return this.machine.inventory.items.reduce(
        (partial_sum, item) => partial_sum + item.pivot.quantity,
        0
      );
    },
  },
  filters: {
    currency(value) {
      var formatter = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 0,
      });
      return formatter.format(value);
    },
  },
  methods: {
    onTransactionCreate() {
      const invent = this.calculateTotalInventory(this.machine.inventory.items);
      var Options = {
        method: "post",
        data: {
          machine: this.machine,
          value: this.value,
          comment: this.comment,
          match: this.match,
          zerobalance: this.zeroBalance,
          inventory: invent,
        },
        url: "/api/transaction/",
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      };
      axios(Options)
        .then(() => {
          let newBalance =
            parseFloat(this.machine.balance) - parseFloat(this.value);

          if (newBalance < 0) newBalance = 0;

          this.machine.balance = this.zeroBalance ? 0 : newBalance;
          this.machine.cost = 0;
          this.$bvModal.hide("transactionModal");
        })
        .catch((msg) => {
          this.alertType = "warning";
          this.alertMessage = msg.response.data;
          this.dismissCountDown = this.dismissSecs;
          this.$bvModal.hide("transactionModal");
        });
    },
    calculateTotalInventory(inventory) {
      return inventory.reduce(
        (partial_sum, item) => partial_sum + item.pivot.quantity,
        0
      );
    },
  },
  mounted() {
    this.value = this.machine.balance;
  },
};
</script>

<style></style>
