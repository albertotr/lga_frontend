<template>
  <div>
    <div class="row" style="margin-top: 20px">
      <div class="col-1">
        <font-awesome-icon
          v-if="machine.type_id == 1"
          icon="dog"
          size="2x"
          class="text-info"
        />
        <font-awesome-icon
          v-if="machine.type_id == 2"
          icon="beer"
          size="2x"
          class="text-warning"
        />
        <font-awesome-icon
          v-if="machine.type_id == 3"
          icon="basketball-ball"
          size="2x"
          class="text-danger"
        />
      </div>
      <div class="col" style="padding-left: 35px">
        <div class="row" style="font-size: larger; font-weight: bolder;">{{ machine.name }}</div>
        
        <div class="row" v-if="machine.type_id == 1 && machine.last_message">
          {{ machine.last_message.data[0].value | currency }}&nbsp;
          <span style="color:lightgray;">[{{ machine.balance | currency }} na maq.]</span>
        </div>
        
        <div class="row" v-if="machine.type_id == 2 && machine.last_message">
          {{
            (machine.last_message.data[0].value +
              machine.last_message.data[1].value)
              | currency
          }}
          <span style="color:lightgray;">[{{ machine.balance | currency }} na maq.]</span>
        </div>
        
        <div class="row" v-if="machine.type_id == 3 && machine.last_message">
          {{ machine.last_message.data[0].value | currency }}
          <span style="color:lightgray;">[{{ machine.balance | currency }} na maq.]</span>
        </div>
        
        <div class="row">
          Qtd:{{ total_quantity }}&nbsp;
          <div style="font-size: small; color:lightgray;">
            <span v-if="(machine.type_id == 1)">Items em estoque</span>
            <span v-if="(machine.type_id == 2)">Litros</span>
            <span v-if="(machine.type_id == 3)">Saida de items</span>
          </div> 
        </div>
        <div class="row">MAC:{{ machine.device.mac }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faBasketballBall,
  faBeer,
  faDog,
} from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
library.add(faBasketballBall, faBeer, faDog);

export default {
  name: "device_info",
  components: {
    "font-awesome-icon": FontAwesomeIcon,
  },
  props: ["machine"],
  computed: {
    total_quantity() {
      var total = 0;
      if (this.machine.inventory.items.length > 0)
        switch (this.machine.type_id) {
          case 1:
            total = this.machine.inventory.items.reduce(
              (tot, item) => item.pivot.quantity + tot,
              0
            );
            break;
          case 2:
            if (this.machine.last_message)
              total =
                this.machine.last_message.data[4].value +
                this.machine.last_message.data[5].value +
                this.machine.last_message.data[6].value +
                this.machine.last_message.data[7].value;
            break;
          case 3:
            if (this.machine.last_message)
              total =
                this.machine.last_message.data[5].value +
                this.machine.last_message.data[7].value +
                this.machine.last_message.data[9].value +
                this.machine.last_message.data[11].value +
                this.machine.last_message.data[13].value;
            break;
          default:
            break;
        }
      return total;
    },
  },
  filters: {
    currency(value) {
      var formatter = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
      });
      return formatter.format(value);
    },
  },
};
</script>

<style>
</style>