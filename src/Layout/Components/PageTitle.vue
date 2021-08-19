<template>
  <div class="app-page-title">
    <div class="page-title-wrapper">
      <div class="page-title-heading">
        <div class="page-title-icon">
          <i :class="icon" />
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
      </div>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
library.add(faArrowCircleLeft);

export default {
  components: {
      "font-awesome-icon": FontAwesomeIcon,
  },
  props: {
    icon: String,
    heading: String,
    subheading: String,
  },
};
</script>
