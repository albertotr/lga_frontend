<template>
  <div>
    <page-title
      :heading="heading"
      :subheading="subheading"
      :icon="icon"
      :showForm.sync="showForm"
    ></page-title>
    <div class="content">
      <user-form
        :form="user_selected"
        :showForm.sync="showForm"
        :user="user_selected"
        v-if="showForm"
      ></user-form>

      <b-table
        :items="users"
        :fields="fields"
        striped
        responsive="sm"
        v-show="!showForm"
      >
        <template #cell(action)="obj">
          <font-awesome-icon
            icon="edit"
            size="2x"
            class="text-info"
            @click="onEditUser(obj.item)"
            v-if="permissions.includes('update-user')"
          />
          &nbsp;
          <font-awesome-icon
            icon="trash"
            size="2x"
            class="text-danger"
            @click="onEditUser(obj.item.id)"
            v-if="permissions.includes('delete-user')"
          />
        </template>
      </b-table>
    </div>
  </div>
</template>

<script>
import PageTitle from "../../Layout/Components/user/PageTitle.vue";
import { mapGetters } from "vuex";
import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import UserForm from "./UserForm.vue";

library.add(faEdit, faTrash);

export default {
  name: "Users",
  components: {
    PageTitle,
    "font-awesome-icon": FontAwesomeIcon,
    UserForm,
  },
  data() {
    return {
      heading: "Administração de Usuários",
      subheading: "Verifique os dados antes de executar as ações.",
      icon: "fa-users text-success",
      users: null,
      user_selected: null,
      fields: [
        { key: "name", label: "Nome" },
        { key: "email", label: "E-Mail" },
        { key: "role.name", label: "Perfil" },
        { key: "action", label: "Ações" },
      ],
      showForm: false,
    };
  },
  created() {
    const token = localStorage.getItem("token");
    var Options = {
      method: "get",
      url: "/api/users/",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios(Options).then((response) => {
      this.users = response.data;
    });
  },
  methods: {
    onEditUser(user) {
      this.user_selected = user;
      this.showForm = true;
    },
  },
  computed: {
    ...mapGetters(["permissions"]),
  },
};
</script>

<style></style>
