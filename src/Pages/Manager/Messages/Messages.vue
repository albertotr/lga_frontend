<template>
  <div>
    <page-title
      :heading="heading"
      :subheading="subheading"
      :icon="icon"
      :showForm.sync="showForm"
    ></page-title>
    <div class="content">
      <div class="main-card mb-3 card">
        <div class="card-body" v-if="!loadingResult">
          <div class="position-relative form-group row">
            <label class="col-3" for="labelFormPartner"
              >Número de mensagens</label
            >
            <div class="col-3">
              <select
                name="numMessage"
                id="numMessage"
                class="form-control-sm form-control"
                v-model="numMessages"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="30">30</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
          </div>
          <div class="row text-white bg-gradient-dark">
            Mensagens recebidas até {{ lastReload.toLocaleString("pt-BR") }}
          </div>
          <div class="row" v-if="messages">
            <ul
              class="list-group list-group-flush list-stripped"
              style="width:100%"
            >
              <li
                class="list-group-item list-group-item-action"
                :class="{ unknownDevice: message.device == null }"
                v-for="message in messages.data"
                :key="message.id"
              >
                <div class="row">
                  <div class="col">
                    {{ message.created_at | friendlyDate }}
                  </div>
                  <div class="col">{{ message.mac }}</div>
                  <div class="col">{{ message.type.code }}</div>
                </div>
                <div class="row" v-if="message.type_id !== 1">
                  <div class="col" v-if="message.type_id == 3">
                    <strong>Mensagem:</strong>&nbsp;{{
                      message.data[0].content
                    }}
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
          <b-row>
            <b-col md="12" v-if="messages.last_page > 1">
              <b-pagination
                size="md"
                :total-rows="messages.total"
                v-model="messages.current_page"
                :per-page="messages.per_page"
                align="center"
                @change="updatePage"
              >
              </b-pagination>
            </b-col>
          </b-row>
        </div>
        <div class="card-body" v-else>
          <div class="text-center text-danger my-2">
            <b-spinner class="align-middle"></b-spinner>
            <strong>Carregando...</strong>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PageTitle from "../../../Layout/Components/PageTitle.vue";
import { mapGetters } from "vuex";
import axios from "axios";

export default {
  name: "ManageMessages",
  components: {
    PageTitle,
  },
  data() {
    return {
      numMessages: 5,
      heading: "Lista de Mensagens",
      subheading: `Listagem das últimas mensagens recebidas.`,
      icon: "pe-7s-mail text-warning",
      messages: null,
      showForm: true,
      lastReload: new Date(),
    };
  },
  created() {
    this.reloadDataTable(1);
  },
  methods: {
    reloadDataTable(currentPage) {
      const token = localStorage.getItem("token");
      var Options = {
        method: "get",
        url: `/api/message/${this.numMessages}?page=${currentPage}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      axios(Options).then((response) => {
        this.messages = response.data;
      });
    },
    updatePage(value) {
      this.reloadDataTable(value);
    },
  },
  computed: {
    ...mapGetters(["permissions"]),
    loadingResult() {
      return this.messages == null;
    },
  },
  filters: {
    friendlyDate: (date) => {
      let novaData = new Date(date);
      return novaData.toLocaleString("pt-BR");
    },
  },
  watch: {
    showForm(value) {
      if (!value) {
        this.messages = null;
        this.reloadDataTable();
        this.lastReload = new Date();
        this.showForm = true;
      }
    },
    numMessages() {
      this.messages = null;
      this.reloadDataTable();
      this.lastReload = new Date();
      this.showForm = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.unknownDevice {
  color: var(--danger) !important;
}
</style>
