<template>
  <div>
    <div class="h-100 bg-plum-plate bg-animation">
      <div class="d-flex h-100 justify-content-center align-items-center">
        <b-col md="6" class="mx-auto app-login-box">
          <div class="modal-dialog w-100">
            <div class="modal-content">
              <div class="modal-header">
                <div class="h5 modal-title">
                  Esqueceu sua senha?
                  <h6 class="mt-1 mb-0 opacity-8">
                    <span>Informe seu e-mail no campo abaixo.</span>
                  </h6>
                </div>
              </div>
              <div class="modal-body">
                <div>
                  <Form>
                    <b-row form>
                      <b-col md="12">
                        <b-form-group>
                          <Label for="exampleEmail">Email</Label>
                          <b-form-input
                            type="email"
                            name="email"
                            id="exampleEmail"
                            v-model="email"
                            placeholder="Inform seu e-mail..."
                          />
                        </b-form-group>
                      </b-col>
                    </b-row>
                  </Form>
                </div>
                <div class="divider" />
                <h6 class="mb-0">
                  <a href="/login" class="text-primary">Tenho a senha</a>
                </h6>
              </div>
              <div class="modal-footer clearfix">
                <div class="float-right">
                  <b-button variant="primary" size="lg" @click="onSubmit">
                    <template v-if="enviando"
                      ><b-spinner small type="grow"></b-spinner>
                      enviando...</template
                    >
                    <template v-else>Enviar</template>
                  </b-button>
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
import axios from "axios";

export default {
  name: "forgot_password",
  data() {
    return {
      email: "",
      enviando: false,
    };
  },
  methods: {
    onSubmit() {
      this.enviando = true;
      var Options = {
        method: "post",
        url: `/api/remember`,
        data: {
          email: this.email,
        },
      };
      axios(Options).then((response) => {
        this.enviando = false;
        if (response) {
          this.$bvModal
            .msgBoxOk(
              "Sua nova senha foi enviada para seu e-mail. Verifique sua caixa de entrada ou a caixa de span."
            )
            .then(() => this.$router.replace("/login"));
        } else {
          this.$bvModal.msgBoxOk(
            "Houve um problema no envio de sua nova senha, recarregue a pagina ou tente mais tarde."
          );
        }
      });
    },
  },
};
</script>
