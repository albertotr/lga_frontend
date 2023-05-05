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
          <div class="row">
            <div class="col-4">
              <h6 class="card-title">Documentações</h6>
              <div
                class="vertical-time-simple vertical-without-time vertical-timeline vertical-timeline--animate vertical-timeline--one-column"
              >
                
                <div class="vertical-timeline-element">
                  <div>
                    <span
                      class="vertical-timeline-element-icon bounce-in"
                    ></span>
                    <div class="vertical-timeline-element-content bounce-in">
                      <router-link :to="{ path: `/manage/ajuda/localizacao` }">
                        <h4 class="timeline-title">Localização</h4>
                      </router-link>
                    </div>
                  </div>
                </div>
                
                <div class="vertical-timeline-element">
                  <div>
                    <span
                      class="vertical-timeline-element-icon bounce-in"
                    ></span>
                    <div class="vertical-timeline-element-content bounce-in">
                      <router-link :to="{ path: `/manage/ajuda/maquina` }">
                        <h4 class="timeline-title">Maquina</h4>
                      </router-link>
                    </div>
                  </div>
                </div>

                <div class="vertical-timeline-element">
                  <div>
                    <span
                      class="vertical-timeline-element-icon bounce-in"
                    ></span>
                    <div class="vertical-timeline-element-content bounce-in">
                      <router-link :to="{ path: `/manage/ajuda/fechamento` }">
                        <h4 class="timeline-title">Fechamento</h4>
                      </router-link>
                    </div>
                  </div>
                </div>
                
                <div class="vertical-timeline-element">
                  <div>
                    <span
                      class="vertical-timeline-element-icon bounce-in"
                    ></span>
                    <div class="vertical-timeline-element-content bounce-in">
                      <router-link :to="{ path: `/manage/ajuda/inicio` }">
                        <h4 class="timeline-title">Inicio</h4>
                      </router-link>
                    </div>
                  </div>
                </div>
                <div class="vertical-timeline-element">
                  <div>
                    <span
                      class="vertical-timeline-element-icon bounce-in"
                    ></span>
                    <div class="vertical-timeline-element-content bounce-in">
                      <router-link :to="{ path: `/manage/ajuda/dashboard` }">
                        <h4 class="timeline-title">Dashboard</h4>
                      </router-link>
                    </div>
                  </div>
                </div>
              </div>


            </div>

            <div class="col-8">
              <h6 class="card-title">Fluxo principal</h6>
              <img src="../../../images/fluxo.png" width="80%" />
            </div>

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