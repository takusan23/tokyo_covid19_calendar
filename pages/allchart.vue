// 範囲を全てにしたグラフ
<template>
  <v-card class="ma-2 pa-2" elevation="10">
    <BarChart height="100%" :chartData="chartData" />
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import BarChart from "../components/BarChart.vue"; // グラフ

/** カレンダーに入れるオブジェクトの型定義ファイル。本当は外に置くべき？ */
interface EventObject {
  /** @param name カレンダーに入れるテキスト */
  name: string;
  /** @param type 日か週 */
  type: "date" | "week";
  /** 件数 */
  count: number;
  /** 開始時間 か 日をまたがない場合は日付 */
  start: string;
  /** 日をまたいだときの終わりの日付。跨がない場合はnull */
  end?: string;
}

interface DataJSON {
  date: string;
  count: CountJSON;
}

interface CountJSON {
  total: number;
}

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
  }),
  mounted() {
    // タイトル変更
    this.$store.commit("setBarTitle", `全範囲グラフ`);
    this.chartData = new Map(this.chartData);
  },
});
</script>