<template>
  <div>
    <page-title
      :heading="heading"
      :subheading="subheading"
      :icon="icon"
    ></page-title>
    <div class="content">
      <div class="main-card mb-3 card">
        <div class="card-body">
          <h5 class="card-title">Setup Inicial</h5>
          <p style="font-size: 10px; color: gray">
            Para o cadastro, siga a ordem de dependencia abaixo
          </p>
          <div
            class="vertical-time-simple vertical-without-time vertical-timeline vertical-timeline--animate vertical-timeline--one-column"
          >
            <div class="vertical-timeline-element">
              <div>
                <span class="vertical-timeline-element-icon bounce-in"></span>
                <div class="vertical-timeline-element-content bounce-in">
                  <router-link :to="{ path: `/admin/ajuda/user` }">
                    <h4 class="timeline-title">Usuario</h4>
                  </router-link>
                </div>
              </div>
            </div>
            <div class="vertical-timeline-element">
              <div>
                <span class="vertical-timeline-element-icon bounce-in"></span>
                <div class="vertical-timeline-element-content bounce-in">
                  <router-link :to="{ path: `/admin/ajuda/operador` }">
                    <h4 class="timeline-title">Operador</h4>
                  </router-link>
                </div>
              </div>
            </div>
            <div class="vertical-timeline-element">
              <div>
                <span class="vertical-timeline-element-icon bounce-in"></span>
                <div class="vertical-timeline-element-content bounce-in">
                  <router-link :to="{ path: `/admin/ajuda/localizacao` }">
                    <h4 class="timeline-title">Localização</h4>
                  </router-link>
                </div>
              </div>
            </div>
            <div class="vertical-timeline-element">
              <div>
                <span class="vertical-timeline-element-icon bounce-in"></span>
                <div class="vertical-timeline-element-content bounce-in">
                  <router-link :to="{ path: `/admin/ajuda/dispositivo` }">
                    <h4 class="timeline-title">Dispositivo</h4>
                  </router-link>
                </div>
              </div>
            </div>
            <div class="vertical-timeline-element">
              <div>
                <span class="vertical-timeline-element-icon bounce-in"></span>
                <div class="vertical-timeline-element-content bounce-in">
                  <router-link :to="{ path: `/admin/ajuda/parceiro` }">
                    <h4 class="timeline-title">Parceiro</h4>
                  </router-link>
                </div>
              </div>
            </div>
            <div class="vertical-timeline-element">
              <div>
                <span class="vertical-timeline-element-icon bounce-in"></span>
                <div class="vertical-timeline-element-content bounce-in">
                  <router-link :to="{ path: `/admin/ajuda/maquina` }">
                    <h4 class="timeline-title">Maquina</h4>
                  </router-link>
                </div>
              </div>
            </div>
            <div class="vertical-timeline-element">
              <div>
                <span class="vertical-timeline-element-icon bounce-in"></span>
                <div class="vertical-timeline-element-content bounce-in">
                  <router-link :to="{ path: `/admin/ajuda/mensagem` }">
                    <h4 class="timeline-title">Mensagens</h4>
                  </router-link>
                </div>
              </div>
            </div>
            <div class="vertical-timeline-element">
              <div>
                <span class="vertical-timeline-element-icon bounce-in"></span>
                <div class="vertical-timeline-element-content bounce-in">
                  <router-link :to="{ path: `/admin/ajuda/inicio` }">
                    <h4 class="timeline-title">Inicio</h4>
                  </router-link>
                </div>
              </div>
            </div>
            <div class="vertical-timeline-element">
              <div>
                <span class="vertical-timeline-element-icon bounce-in"></span>
                <div class="vertical-timeline-element-content bounce-in">
                  <router-link :to="{ path: `/admin/ajuda/dashboard` }">
                    <h4 class="timeline-title">Dashboard</h4>
                  </router-link>
                </div>
              </div>
            </div>
            <!-- <div class="vertical-timeline-element">
              <div>
                <span class="vertical-timeline-element-icon bounce-in"></span>
                <div class="vertical-timeline-element-content bounce-in">
                  <p>
                    Yet another one, at
                    <span class="text-success">15:00 PM</span>
                  </p>
                </div>
              </div>
            </div>
            <div class="vertical-timeline-element">
              <div>
                <span class="vertical-timeline-element-icon bounce-in"></span>
                <div class="vertical-timeline-element-content bounce-in">
                  <h4 class="timeline-title">Build the production release</h4>
                </div>
              </div>
            </div>
            <div class="vertical-timeline-element">
              <div>
                <span class="vertical-timeline-element-icon bounce-in"></span>
                <div class="vertical-timeline-element-content bounce-in">
                  <h4 class="timeline-title text-success">
                    Something not important
                  </h4>
                </div>
              </div>
            </div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PageTitle from "../../../Layout/Components/PageTitle.vue";
export default {
  name: "help",
  components: {
    PageTitle,
  },
  data() {
    return {
      heading: "Manual",
      subheading: "Manual de uso e cadastros.",
      icon: "book",
    };
  },
};
</script>

<style>
</style>