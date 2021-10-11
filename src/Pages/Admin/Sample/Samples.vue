<template>
  <div>
    <b-alert
      :show="dismissCountDown"
      dismissible
      :variant="alertType"
      @dismissed="dismissCountDown = 0"
      @dismiss-count-down="countDownChanged"
    >
      <p>{{ alertMessage }}</p>
      <b-progress
        :variant="alertType"
        :max="dismissSecs"
        :value="dismissCountDown"
        height="4px"
      ></b-progress>
    </b-alert>
    <page-title
      :heading="heading"
      :subheading="subheading"
      :icon="icon"
      @clearForm="clearForm"
      :showForm.sync="showForm"
    ></page-title>
    <div class="content">
      <sample-form
        :showForm.sync="showForm"
        :sample="sample_selected"
        @updateDataTable="reloadDataTable"
        v-if="showForm"
      ></sample-form>

      <b-table
        :items="samples"
        :fields="fields"
        striped
        bordered
        hover
        :busy="loadingTableResult"
        responsive="sm"
        v-show="!showForm"
      >
        <template #cell(action)="obj">
          <font-awesome-icon
            icon="edit"
            size="2x"
            class="text-info"
            @click="onEditSample(obj.item)"
            v-if="
              permissions.includes('update-device') &&
                !obj.item.machine &&
                !obj.item.deleted_at
            "
          />
          &nbsp;
          <font-awesome-icon
            icon="trash"
            size="2x"
            class="text-danger"
            @click="onDeleteSample(obj.item)"
            v-if="
              permissions.includes('delete-device') &&
                !obj.item.machine &&
                !obj.item.deleted_at
            "
          />

          <font-awesome-icon
            icon="recycle"
            size="2x"
            class="text-warning"
            @click="onRestoreSample(obj.item)"
            v-if="permissions.includes('delete-device') && obj.item.deleted_at"
          />
          &nbsp;
          <font-awesome-icon
            icon="bomb"
            size="2x"
            class="text-danger"
            @click="onForceDeleteSample(obj.item)"
            v-if="
              permissions.includes('delete-device') &&
                obj.item.deleted_at &&
                obj.item.machine_count == '0'
            "
          />
        </template>

        <template #table-busy>
          <div class="text-center text-danger my-2">
            <b-spinner class="align-middle"></b-spinner>
            <strong>Carregando...</strong>
          </div>
        </template>
      </b-table>
    </div>
  </div>
</template>


<script>
import PageTitle from "../../../Layout/Components/PageTitleAdd.vue";
import { mapGetters } from "vuex";
import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faEdit,
  faTrash,
  faRecycle,
  faBomb,
} from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import SampleForm from "../Sample/SampleForm.vue";

library.add(faEdit, faTrash, faRecycle, faBomb);

export default {
  name: "Samples",
  components: {
    PageTitle,
    "font-awesome-icon": FontAwesomeIcon,
    SampleForm,
  },
  data() {
    return {
      heading: "Administração de Modelos de Máquinas",
      subheading: "Verifique os dados antes de executar as ações.",
      icon: "clipboard-list",
      samples: null,
      sample_selected: null,
      fields: [
        { key: "name", label: "Name" },
        { key: "slot", label: "Slot" },
        { key: "machine_count", label: "Maquinas" },
        { key: "action", label: "Ações" },
      ],
      showForm: false,
      dismissSecs: 10,
      dismissCountDown: 0,
      alertType: "success",
      alertMessage: "",
    };
  },
  created() {
    this.reloadDataTable();
  },
  methods: {
    onEditSample(sample) {
      this.sample_selected = sample;
      this.showForm = true;
    },
    onDeleteSample(sample) {
      this.boxTwo = "";
      this.$bvModal
        .msgBoxConfirm(`Deseja realmente excluir o modelo ${sample.name}?`, {
          title: "Confirme a exclusão",
          size: "sm",
          buttonSize: "sm",
          okVariant: "success",
          okTitle: "Sim",
          cancelTitle: "Não",
          footerClass: "p-2",
          hideHeaderClose: false,
        })
        .then((confirm) => {
          if (confirm) {
            const token = localStorage.getItem("token");
            var Options = {
              method: "delete",
              url: `/api/sample/${sample.id}`,
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-type": "Application/Json",
              },
            };
            axios(Options).then((response) => {
              if (response.data) {
                this.alertType = "success";
                this.alertMessage = "Modelo excluido com sucesso.";
                this.dismissCountDown = this.dismissSecs;
                this.reloadDataTable();
              } else {
                this.alertType = "danger";
                this.alertMessage = "Problemas ao excluir o Modelo!";
                this.dismissCountDown = this.dismissSecs;
              }
            });
          }
        });
    },
    onRestoreSample(sample) {
      this.boxTwo = "";
      this.$bvModal
        .msgBoxConfirm(`Deseja realmente restaurar o modelo ${sample.name}?`, {
          title: "Confirme a Restauração",
          size: "sm",
          buttonSize: "sm",
          okVariant: "success",
          okTitle: "Sim",
          cancelTitle: "Não",
          footerClass: "p-2",
          hideHeaderClose: false,
        })
        .then((confirm) => {
          if (confirm) {
            const token = localStorage.getItem("token");
            var Options = {
              method: "get",
              url: `/api/sample/restore/${sample.id}`,
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-type": "Application/Json",
              },
            };
            axios(Options).then((response) => {
              if (response.data) {
                this.alertType = "success";
                this.alertMessage = "Modelo restaurado com sucesso.";
                this.dismissCountDown = this.dismissSecs;
                this.reloadDataTable();
              } else {
                this.alertType = "danger";
                this.alertMessage = "Problemas ao restaurar o modelo!";
                this.dismissCountDown = this.dismissSecs;
              }
            });
          }
        });
    },
    onForceDeleteSample(sample) {
      this.boxTwo = "";
      this.$bvModal
        .msgBoxConfirm(
          `Deseja excluir permanentemente o modelo ${sample.name}?`,
          {
            title: "Confirme a Exclusão",
            size: "sm",
            buttonSize: "sm",
            okVariant: "success",
            okTitle: "Sim",
            cancelTitle: "Não",
            footerClass: "p-2",
            hideHeaderClose: false,
          }
        )
        .then((confirm) => {
          if (confirm) {
            const token = localStorage.getItem("token");
            var Options = {
              method: "delete",
              url: `/api/sample/forcedelete/${sample.id}`,
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-type": "Application/Json",
              },
            };
            axios(Options)
              .then((response) => {
                if (response.data) {
                  this.alertType = "success";
                  this.alertMessage = "Modelo excluido permanentemente.";
                  this.dismissCountDown = this.dismissSecs;
                  this.reloadDataTable();
                } else {
                  this.alertType = "danger";
                  this.alertMessage = "Problemas ao excluir o modelo!";
                  this.dismissCountDown = this.dismissSecs;
                }
              })
              .catch(() => {
                this.alertType = "danger";
                this.alertMessage =
                  "Problemas ao excluir o modelo, provavelmente existe uma Máquina vinculada a este modelo!";
                this.dismissCountDown = this.dismissSecs;
              });
          }
        });
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown;
    },
    clearForm() {
      this.sample_selected = null;
      this.showForm = true;
    },
    reloadDataTable(value) {
      if (value !== undefined && value.status) {
        this.alertType = "warning";

        this.alertMessage = "Verifique o formulário";
        this.dismissCountDown = this.dismissSecs;
      } else if (value || value === undefined) {
        const token = localStorage.getItem("token");
        var Options = {
          method: "get",
          url: "/api/sample/",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        axios(Options).then((response) => {
          this.samples = response.data;
        });
      }

      if (value === true) {
        this.alertType = "success";
        this.alertMessage = `Modelo inserido/editado com sucesso.`;
        this.dismissCountDown = this.dismissSecs;
      }
    },
  },
  computed: {
    ...mapGetters(["permissions"]),
    loadingTableResult() {
      return this.samples == null;
    },
  },
};
</script>

<style></style>
