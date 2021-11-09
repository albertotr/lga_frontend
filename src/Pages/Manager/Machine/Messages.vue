<template>
  <div class="content">
    <page-title
      :heading="heading"
      :subheading="subheading"
      :icon="icon"
      :showForm.sync="showForm"
    ></page-title>
    <div class="main-card mb-3 card">
      <div class="card-body" v-if="messages">
        <h5>Mensagens da Maquina</h5>
        <div class="row text-white bg-gradient-dark">
          <div class="col">
            <strong>Dispositivo:</strong
            ><template v-if="machine.device">{{ machine.device.mac }}</template>
          </div>
          <div class="col"><strong>Tipo:</strong> {{ machine.type.name }}</div>
          <div class="col">
            <strong>Modelo:</strong> {{ machine.sample.name }} |
            {{ machine.sample.slot }} Slots
          </div>
          <div class="col">
            <strong>Parceiro(s):</strong>
            <span v-for="partner in machine.partners" :key="partner.id">
              {{ partner.name }};
            </span>
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
import PageTitle from "../../../Layout/Components/PageTitle.vue";
import axios from "axios";
export default {
  name: "Machine_Messages",
  data() {
    return {
      machine: null,
      messages: null,

      token: null,
      heading: "Mensagens da Máquinas",
      subheading: "Verifique os dados antes de executar as ações.",
      icon: "pe-7s-server text-warning",

      showForm: true,
    };
  },
  components: {
    PageTitle,
  },
  methods: {
    loadMessages(){
      var Options = {
        method: "get",
        url: `/api/machine/messages/${this.machine.id}/10`,
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      };
      axios(Options).then((response) => {
        this.messages = response.data;
      });
    }
  },
  created() {
    
    if(!this.$route.params.machine){
      this.$router.push('/manage/machine');
      return false;
    } 

    this.token = localStorage.getItem("token");
    this.machine = this.$route.params.machine;
    this.loadMessages();
  },
  watch:{
    showForm(value){
      if(!value) this.$router.go(-1);
    },
  },
  filters: {
    friendlyDate: (date) => {
      let novaData = new Date(date);
      return novaData.toLocaleString("pt-BR");
    },
  },
};
</script>

<style></style>
