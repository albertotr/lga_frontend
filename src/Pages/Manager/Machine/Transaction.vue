<template>
  <div>
    <div class="row" v-if="machine">
      <div
        class="alert alert-warning col-12"
        v-if="rentalDays == 0"
        role="alert"
      >
        Já foi efetuado uma transação hoje.
      </div>

      <b-col sm="6">
        <label class="">Maquina:&nbsp;</label
        ><span>{{ this.machine.serial }}</span>
      </b-col>
      <b-col sm="6">
        <label class="">MAC:&nbsp;</label
        ><span>{{ this.machine.device.mac }}</span>
      </b-col>
      <b-col sm="6">
        <label class="">Saldo Bruto:&nbsp;</label
        ><span>{{ this.machine.total_balance | currency }}</span>
      </b-col>
      <b-col sm="6">
        <label class="">Saldo:&nbsp;</label
        ><span>{{ this.machine.balance | currency }}</span>
      </b-col>

      <div class="b-col">&nbsp;</div>

      <b-col
        sm="12"
        v-for="item in this.machine.inventory.items"
        :key="item.id"
      >
        <b-row>
          <b-col class="col-12"
            ><label class="">Item:&nbsp;</label
            ><span>{{ item.name }}</span></b-col
          >
          <b-col class="col-xs-4 col-sm-4"
            ><label class="">Estoque:&nbsp;</label
            ><span>{{ item.pivot.quantity }}</span></b-col
          >

          <b-col class="col-xs-4 col-sm-4"
            ><label class="">Saida:&nbsp;</label
            ><span>{{ outItem(item.id) }}</span></b-col
          >

          <b-col class="col-xs-4 col-sm-4"
            ><label class="">Custo:&nbsp;</label
            ><span>{{ costItem(item.id) | currency }}</span></b-col
          >
        </b-row>
      </b-col>
      <b-col
        ><button class="btn btn-sm btn-primary" v-b-modal.inventoryModal>
          Editar Estoque
        </button></b-col
      >

      <b-col sm="12">&nbsp;</b-col>

      <b-col sm="6">
        <label class="">Aluguel:&nbsp;</label
        ><span>{{ this.totalRent | currency }} / {{ rentalDays }} dias</span>
      </b-col>

      <b-col sm="6">
        <label class="">Custo Total:&nbsp;</label
        ><span>{{ totalCost | currency }}</span>
      </b-col>

      <b-col sm="6">
        <label class="">Comissão:&nbsp;</label
        ><span>{{ totalComission | currency }}</span>
      </b-col>

      <b-col sm="6">
        <label class="">Estoque total esperado:&nbsp;</label
        ><span>{{ this.totalInventory }}</span>
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
        <button
          class="btn btn-primary"
          @click.stop="onTransactionCreate"
          :disabled="rentalDays == 0"
        >
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
      rent: {
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
      rentalDays: 0,
      lastTransaction: null,
    };
  },
  components: {
    MachineInventory,
  },
  props: {
    machine: Object,
    transaction: Object,
  },
  computed: {
    ...mapGetters(["permissions", "user"]),
    totalInventory() {
      return this.machine.inventory.items.reduce(
        (partial_sum, item) => partial_sum + item.pivot.quantity,
        0
      );
    },
    totalRent() {
      let rent = this.machine.fixed_value;
      let days = this.rentalDays;
      return (parseFloat(rent) / 30) * parseInt(days);
    },
    totalComission() {
      const operator = this.machine.operators.filter((operator) => {
        return operator.user_id == this.user.id;
      });

      var totalComission = 0;

      //usuario autenticado não é o operador
      if (operator.length == 0) {
        if (this.user.role.level == 0) {
          return this.machine.balance - this.totalRent - this.totalCost;
        } else return totalComission;
      }

      totalComission =
        (this.machine.balance - this.totalRent - this.machine.cost) *
        parseFloat(operator[0].pivot.participation / 100);

      return totalComission;
    },
    totalCost() {
      return this.machine.inventory.items.reduce(
        (acumulador, item) =>
          acumulador + this.outItem(item.id) * item.pivot.price,
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
      var Options = {
        method: "post",
        data: {
          machine: this.machine,
          value: this.value,
          comment: this.comment,
          match: this.match,
          zerobalance: this.zeroBalance,
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
    outItem(itemId) {
      let itemAtual = this.machine.inventory.items.filter((item) => {
        return item.id == itemId;
      });

      let itemTransaction = null;
      let itemExchanges = null;
      if (this.lastTransaction !== null) {
        itemTransaction = this.lastTransaction.inventory.filter((item) => {
          return item.id == itemId;
        });

        if (this.lastTransaction.exchanges !== null) {
          itemExchanges = this.lastTransaction.exchanges.filter((exchange) => {
            return exchange.item_id == itemId;
          });
        }
      }

      const totalExchange = (itemExchanges)?itemExchanges.reduce( (soma, value) =>  soma + value.quantity,0):0;
      
      return itemTransaction == null
        ? itemAtual[0].pivot.base_quantity - itemAtual[0].pivot.quantity
        : itemTransaction[0].pivot.quantity + totalExchange - itemAtual[0].pivot.quantity;
    },

    costItem(itemId) {
      let qtdItem = this.outItem(itemId);
      let item = this.machine.inventory.items.filter((item) => {
        return item.id == itemId;
      });
      return parseFloat(qtdItem * item[0].pivot.price);
    },
  },
  mounted() {
    this.value = this.machine.balance;
    var Options = {
      method: "get",
      url: `/api/transaction/last/${this.machine.id}`,
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    };
    axios(Options)
      .then((result) => {
        this.lastTransaction = result.data == "" ? null : result.data;

        let now = null;
        let dt = null;

        if (this.lastTransaction !== null) {
          this.lastTransaction.inventory = JSON.parse(
            this.lastTransaction.inventory
          );
          now = new Date(Date.now()).setHours(0, 0, 1, 0);
          dt = new Date(this.lastTransaction.created_at).setHours(0, 0, 0, 0);
        } else {
          now = new Date(Date.now()).setHours(0, 0, 1, 0);
          dt = new Date(this.machine.created_at).setHours(0, 0, 0, 0);
        }

        let diffMs = now - dt;
        let diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        this.rentalDays = diffDays - 1;
      })
      .catch((msg) => {
        console.log(msg);
      });
  },
};
</script>

<style></style>
