<template>
  <div class="app-page-title">
    <div class="page-title-wrapper">
      <div class="page-title-heading">
        <div class="page-title-icon">
          <font-awesome-icon :icon="icon" class="text-info" />
        </div>
        <div>
          {{ heading }}
          <div class="page-title-subheading">
            {{ subheading }}
          </div>
        </div>
      </div>
      <div class="page-title-actions">
        <button type="button" class="btn-shadow mr-3 btn btn-dark" @click="$emit('update:showForm', false)">
          <font-awesome-icon
            icon="arrow-circle-left"
            size="1x"
          />
        </button>
        <button
          type="button"
          class="btn-shadow d-inline-flex align-items-center btn btn-success text-white"
          @click="onCreate()"
        >
          <font-awesome-icon class="mr-2" icon="plus" />
          Adicionar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faStar, faPlus, faUsers, faArrowCircleLeft, faCogs, faServer, faUsersCog } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faStar, faPlus, faUsers, faArrowCircleLeft, faCogs, faServer, faUsersCog);

export default {
  components: {
    "font-awesome-icon": FontAwesomeIcon,
  },
  props: {
    icon: String,
    heading: String,
    subheading: String,
    showForm: Boolean,
  },
  methods: {
    onCreate() {
      this.$emit("clearForm");
    },
  },
};
</script>
