<template>
  <div class="p-0 bd-highlight">
    <b-card no-body header="Alterar Senha">
      <b-card-body>
        <b-form>
          <label for="inline-form-input-password">Nova Senha</label>
          <b-input-group class="mb-2 mr-sm-2 mb-sm-2">
            <b-form-input
              id="inline-form-input-password"
              type="password"
              v-model="password"
              @focus="error = false"
            ></b-form-input>
          </b-input-group>

          <label for="inline-form-input-password">Repetir Senha</label>
          <b-input-group class="mb-2 mr-sm-2 mb-sm-2">
            <b-form-input
              id="inline-form-input-password"
              type="password"
              v-model="confirmPassword"
            ></b-form-input>
          </b-input-group>

          <b-row>
            <b-col class="mb-2">
              <small id="passwordHelp" class="form-text text-muted">
                A nova senha precisa conter no mínimo
                <span :class="has_minimum_lenth ? 'has_required' : ''">
                  8 digitos</span
                >,
                <span :class="has_lowercase ? 'has_required' : ''"
                  >uma letra minuscula</span
                >,
                <br>
                <span :class="has_uppercase ? 'has_required' : ''"
                  >uma letra maiuscula</span
                >,
                <span :class="has_number ? 'has_required' : ''">um número</span
                >,
                <span :class="has_special ? 'has_required' : ''"
                  >um caracter especial</span
                > e
                <span :class="has_confirm ? 'has_required' : ''"
                  >confirmação da senha.</span
                >
              </small>

              <small style="color:red" v-if="error">
                Verifique a regra acima. A senha não obedece as regras
                definidas.
              </small>
            </b-col>
          </b-row>

          <b-overlay
            :show="busy"
            rounded
            opacity="0.6"
            spinner-small
            spinner-variant="primary"
            class="d-inline-block"
          >
            <b-button variant="primary" @click="changePass()">Alterar</b-button>
          </b-overlay>
        </b-form>
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";
export default {
  name: "change_password",
  data() {
    return {
      token: null,
      busy: false,
      password: "",
      confirmPassword: "",
      has_minimum_lenth: false,
      has_number: false,
      has_lowercase: false,
      has_uppercase: false,
      has_special: false,
      has_confirm: false,
      error: false,
    };
  },
  methods: {
    changePass() {
      this.busy = true;
      if (
        !this.has_minimum_lenth ||
        !this.has_number ||
        !this.has_lowercase ||
        !this.has_uppercase ||
        !this.has_special ||
        !this.has_confirm
      ) {
        this.error = true;
        this.busy = false;
        return false;
      }

      var Options = {
        method: "put",
        url: `/api/user/password/${this.user.id}`,
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
        data: {
          password: this.password,
        },
      };

      axios(Options)
        .then(() => {
          this.$bvModal.msgBoxOk("Senha do usuário foi alterado com sucesso.", {
            title: "Mensagem!",
            size: "sm",
            buttonSize: "sm",
            okVariant: "info",
            okTitle: "OK",
            hideHeaderClose: false,
          });
          this.password = '';
          this.confirmPassword = '';
        })
        .catch(() => {
          this.$bvModal.msgBoxOk(
            "Problema ao alterar a senha, tente novamente ou contate o suporte.",
            {
              title: "Aviso!",
              size: "sm",
              buttonSize: "sm",
              okVariant: "danger",
              okTitle: "OK",
              hideHeaderClose: false,
            }
          );
        })
        .finally(() => {
          this.busy = false;
        });
    },
  },
  created() {
    this.token = localStorage.getItem("token");
  },
  computed: {
    ...mapGetters(["user"]),
  },
  watch: {
    password() {
      this.has_minimum_lenth = this.password.length > 8;
      this.has_number = /\d/.test(this.password);
      this.has_lowercase = /[a-z]/.test(this.password);
      this.has_uppercase = /[A-Z]/.test(this.password);
      this.has_special = /[!@#\\$%\\^\\&*\\)\\(+=._-]/.test(this.password);
      this.has_confirm = (this.password === this.confirmPassword) && (this.password !== '');
    },
    confirmPassword() {
      this.has_confirm = (this.password === this.confirmPassword) && (this.password !== '');
    },
  },
};
</script>

<style scoped>
.card {
  margin: 0px 2px 0px 2px !important;
}
.card-header {
  font-weight: bold;
}
.has_required {
  text-decoration: line-through;
  color: #689868;
}
</style>
