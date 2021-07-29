<template>
  <div>
    <div class="h-100 bg-plum-plate bg-animation">
      <div class="d-flex h-100 justify-content-center align-items-center">
        <b-col md="10" class="mx-auto app-login-box">
          <div class="modal-dialog w-100 mx-auto">
            <div class="modal-content">
              <div class="modal-title">
                <b-alert
                  :show="dismissCountDown"
                  variant="danger"
                  dismissible
                  @dismissed="dismissCountDown = 0"
                  @dismiss-count-down="countDownChanged"
                >
                  <font-awesome-icon
                    icon="exclamation-triangle"
                    size="1x"
                    class="text-danger"
                  />
                  {{ message }}
                </b-alert>
              </div>
              <div class="modal-body">
                <div class="h5 modal-title text-center">
                  <h4 class="mt-2">
                    <div>LGA Sistemas</div>
                    <span
                      >Olá, informe suas credenciais abaixo para entrar no
                      sistema.</span
                    >
                  </h4>
                </div>
                <b-form-group
                  id="exampleInputGroup1"
                  label-for="exampleInput1"
                  description="Nunca compartilhe suas credenciais."
                >
                  <b-form-input
                    id="exampleInput1"
                    type="email"
                    required
                    placeholder="Enter email..."
                    v-model="form.email"
                  >
                  </b-form-input>
                </b-form-group>
                <b-form-group id="exampleInputGroup2" label-for="exampleInput2">
                  <b-form-input
                    id="exampleInput2"
                    type="password"
                    required
                    placeholder="Enter password..."
                    v-model="form.password"
                  >
                  </b-form-input>
                </b-form-group>
              </div>
              <div class="modal-footer clearfix">
                <div class="float-left">
                  <a href="/forgot-password" class="btn-lg btn btn-link"
                    >Recuperar senha</a
                  >
                </div>
                <div class="float-right">
                  <b-button variant="primary" size="lg" @click="onSignin"
                    >Autenticar</b-button
                  >
                </div>
              </div>
            </div>
          </div>
          <div class="text-center text-white opacity-8 mt-3">
            Copyright &copy; ArchitectUI 2019
          </div>
        </b-col>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";

library.add(faExclamationTriangle);

export default {
  name: "Login",
  data() {
    return {
      form: {
        email: "alberto@email.com.br",
        password: "password",
      },
      message: null,
      dismissSecs: 5,
      dismissCountDown: 0,
    };
  },

  methods: {
    ...mapActions({
      signIn: "signIn",
      teste: "teste",
    }),
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown;
    },
    onSignin() {
      const vue = this;
      this.signIn(this.form)
        .then((response) => {
          if (response) vue.$router.replace("/");
        })
        .catch((error) => {
          if (error.response.status == 401)
            this.message = "Credenciais incorretas, revise seu e-mail e senha";
          else
            this.message =
              "Problemas no envio das credenciais, atualize a página e tente novamente.";

          this.dismissCountDown = this.dismissSecs;
        });
    },
  },
  components: {
    "font-awesome-icon": FontAwesomeIcon,
  },
};
</script>
