<template>
  <v-layout>
    <v-flex>
      <v-card outlined class="pa-5">
        <nuxt-content :document="readme" />
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  components: {},
  async asyncData({ $content, params }) {
    // content/README.md読み込み
    const readme = await $content("README").fetch();
    return { readme };
  },
  data: () => ({
    title: "このサイトについて",
  }),
  mounted() {
    // タイトル変更
    this.$store.commit("setBarTitle", this.title);
  },

  head() {
    const title = this.title;
    const url = `https://tokyo-covid19-calendar.netlify.app${this.$route.path}/`;
    return {
      title: title,
      meta: [
        { hid: "og:url", property: "og:url", content: url },
        { hid: "og:title", property: "og:title", content: title },
      ],
    };
  },
});
</script>