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

export default Vue.extend({
  data: () => ({
    chartData: new Map<string, number>(),
  }),
  mounted() {
    // タイトル変更
    this.$store.commit("setBarTitle", `全範囲グラフ`);
    // データ用意
    // Vuex Storeから取り出す
    const csvData = this.$store.state.csvData.body as any[];
    // 日付と感染者数のMap
    const dayCountMap = new Map<string, number>();
    // 一日ごと
    csvData.forEach((item) => {
      // 一個ずつ見ていく
      // 日付
      const date = item.公表_年月日;
      if (dayCountMap.has(date)) {
        // キーが有る場合はカウントを増やす
        dayCountMap.set(date, dayCountMap.get(date)!! + 1);
      } else {
        // 無いので作成
        dayCountMap.set(date, 1);
      }
      this.chartData = dayCountMap;
    });
  },
});
</script>