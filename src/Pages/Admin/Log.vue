<template>
  <section>
    {{ logs[0] }}
  </section>
</template>

<script>
import axios from "axios";
export default {
  name: "Logs",
  data() {
    return {
      logs: [],
      fields: ["Date", "last_name", "age"],
    };
  },
  created() {
    let vue = this;
    var Options = {
      method: "get",
      url: `/api/device/log/show`,
      headers: {
        "Content-type": "Application/Json",
      },
    };
    axios(Options).then((response) => {
        vue.logs = response.data;
    });
  },
};
</script>

<style></style>
