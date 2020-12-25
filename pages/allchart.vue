// 範囲を全てにしたグラフ
<template>
  <v-card class="ma-2 pa-2" elevation="10">
    <BarChart height="100%" :chartData="chartData" />
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import BarChart from "../components/BarChart.vue"; // グラフ
import { EventObject, DataJSON, CountJSON } from "@/ts/ObjectType.ts"; // 型定義

export default Vue.extend({
  async asyncData({ $content, params }) {
    // content/data.json読み込み
    const jsonData = await $content("data").fetch();

    // データ(オブジェクト)だけのJSON配列に（拡張子の情報とかいらん）
    const jsonList = new Array<DataJSON>();
    (Object.values(jsonData) as DataJSON[]).forEach((json) => {
      if (json.date !== undefined) {
        jsonList.push(json);
      }
    });
    // グラフにわたすデータ
    const chartData = new Map<String, number>();
    jsonList.forEach((json) => {
      chartData.set(json.date, json.count.total);
    });
    return { chartData: chartData };
  },
  data: () => ({
    chartData: new Map<string, number>(),
    title: "全範囲グラフ",
  }),
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
  mounted() {
    // タイトル変更
    this.$store.commit("setBarTitle", `全範囲グラフ`);
    this.chartData = new Map(this.chartData);
  },
});
</script>