<template>
  <div>
    <page-title
      :heading="heading"
      :subheading="subheading"
      :icon="icon"
      @addForm="addClosure"
    ></page-title>

    <div class="content">
      <div class="text-center text-danger my-2" v-if="closures == null">
        <b-spinner class="align-middle"></b-spinner>
        <strong>Carregando...</strong>
      </div>

      <div v-else>
        <b-list-group v-for="closure in closures.data" :key="closure.id">
          <b-list-group-item>
            <router-link
              class="d-flex flex-md-row justify-content-md-between flex-column"
              :to="{
                name: 'manageclosuretransactions',
                params: { closure: closure.id },
              }"
            >
              <div class="p-0">
                <b-badge class="label">Operador</b-badge><br />
                <span>{{ closure.operator.name }}</span>
              </div>

              <div class="p-0">
                <b-badge class="label">Valor</b-badge><br />
                <span>{{ getValue(closure) | currency }}</span>
              </div>

              <div class="p-0">
                <b-badge class="label">De</b-badge><br />
                <span>{{ getFirstDate(closure) | friendlyDate }}</span>
              </div>

              <div class="p-0">
                <b-badge class="label">Até</b-badge><br />
                <span>{{ getLastDate(closure) | friendlyDate }}</span>
              </div>

              <div class="p-0">
                <b-badge class="label">Fechamento</b-badge><br />
                <span
                  >{{ closure.created_at | friendlyDate }} |
                  {{ closure.user.name }}</span
                >
              </div>
            </router-link>
          </b-list-group-item>
        </b-list-group>
        <b-pagination
          size="md"
          :total-rows="closures.total"
          v-model="closures.current_page"
          :per-page="closures.per_page"
          align="center"
          @change="updatePage"
        >
        </b-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import PageTitle from "../../../Layout/Components/PageTitleAdd.vue";
import axios from "axios";
export default {
  name: "closures",
  components: {
    PageTitle,
  },
  data() {
    return {
      heading: "Fechamentos",
      subheading: "Lista de fechamento financeiro",
      icon: "landmark",
      closures: null,
      perPage: 5,
      token: null,
    };
  },
  computed: {
    loadingTableResult() {
      return this.closures == null;
    },
  },
  methods: {
    loadClosure(currentPage) {
      var Options = {
        method: "get",
        url: `/api/closure/${this.perPage}?page=${currentPage}`,
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      };
      axios(Options).then((response) => {
        this.closures = response.data;
      });
    },
    updatePage(value) {
      this.loadClosure(value);
    },
    getValue(closure) {
      let sumary = closure.transactions.reduce((sum, transaction) => {
        return sum + parseFloat(transaction.amount);
      }, 0);
      return sumary;
    },
    getFirstDate(closure) {
      return closure.transactions.reduce(function(first, transaction) {
        return first <= transaction.created_at ? first : transaction.created_at;
      }, closure.transactions[0].create_at);
    },
    getLastDate(closure) {
      return closure.transactions.reduce(function(last, transaction) {
        return last >= transaction.created_at ? last : transaction.created_at;
      }, closure.transactions[0].create_at);
    },
    addClosure() {
      this.$router.push({ path: `/manage/closure/add` });
    },
  },
  created() {
    this.token = localStorage.getItem("token");
    this.loadClosure(1);
  },
  filters: {
    friendlyDate: (date) => {
      let novaData = new Date(date);
      return novaData.toLocaleString("pt-BR");
    },
    currency(value) {
      var formatter = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 0,
      });
      return formatter.format(value);
    },
  },
};
</script>

<style scoped>
.label {
  font-size: 0.8em;
  line-height: 0.6em;
  border: 1px solid #999;
  background-color: transparent;
}
.list-group-item a{
  text-decoration: none;
  color: #5a5a5a;;
}

</style>
