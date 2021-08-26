<template>
  <div class="content">
    <div class="main-card mb-3 card">
      <div class="card-body">
        <h5>Mensagens da Maquina</h5>
        <div class="row text-white bg-gradient-dark">
          <div class="col">
            <strong>Dispositivo:</strong
            ><template v-if="machine.device">{{ machine.device.mac }}</template>
          </div>
          <div class="col"><strong>Tipo:</strong> {{ machine.type.name }}</div>
          <div class="col">
            <strong>Modelo:</strong> {{ machine.sample.name }}/{{
              machine.sample.slot
            }}.Slots
          </div>
          <div class="col">
            <strong>Cliente:</strong
            ><template v-if="machine.device">
              {{ machine.partner.name }}</template
            >
          </div>
        </div>
        <div class="row" v-if="messages.length > 0">
          <ul
            class="list-group list-group-flush list-stripped"
            style="width:100%"
          >
            <li
              class="list-group-item list-group-item-action"
              v-for="message in messages"
              :key="message.id"
            >
              <div class="row">
                <div class="col">{{ message.created_at | friendlyDate }}</div>
                <div class="col">{{ message.type.code }}</div>
              </div>
              <div class="row" v-if="message.type_id !== 1">
                <div class="col" v-if="message.type_id == 3">
                  <strong>Mensagem:</strong>&nbsp;{{ message.data[0].content }}
                </div>
                <template v-if="message.type_id == 2">
                  <div class="col" v-for="dt in message.data" :key="dt.id">
                    <strong>{{ dt.code }}:</strong>{{ dt.value }}
                  </div>
                </template>
              </div>
            </li>
          </ul>
        </div>
        <div class="row" v-else>
          <ul class="list-group list-group-flush" style="width:100%">
            <li class="list-group-item">Sem mensagens recebidas</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Machine_Messages",
  data() {
    return {};
  },
  props: {
    machine: null,
    messages: null,
  },
  methods: {},
  created() {},
  filters: {
    friendlyDate: (date) => {
      let novaData = new Date(date);
      return novaData.toLocaleString("pt-BR");
    },
  },
};
</script>

<style></style>
