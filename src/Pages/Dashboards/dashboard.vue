<template>
  <div class="content row mb-3">
    <b-col xs-12>
      <b-card>        
        <div class="row" v-if="machines">
          <div class="col-xs-12 col-sm-6 col-lg-3" v-for="machine in machines.data" :key="machine.id">
            <device-info :machine="machine"/>
          </div>
        </div>
      </b-card>
    </b-col>
  </div>
</template>
  
  <script>
import axios from "axios";
import DeviceInfo from './gadget/DeviceInfo.vue';
import { mapGetters } from "vuex";

export default {
  components: {
    DeviceInfo,
  },
  name: 
    "dashboard",
  data() {
    return {
        machines:null
    };
  },
  methods: {
    loadMachines(currentPage) {
      var Options = {
        method: "post",
        data: this.data,
        url: `/api/machine/paginate/20?page=${currentPage}`,
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      };
      axios(Options).then((response) => {
        this.machines = response.data;
        setTimeout(() => {
          console.log('reload');
          this.loadMachines(1);
        }, this.refresh_time);
      });
    }
  },
  created() {
    this.loadMachines(1);    
  },
  computed: {
    ...mapGetters(["refresh_time"]),
  },
};
</script>
  
  <style scoped>
</style>
  