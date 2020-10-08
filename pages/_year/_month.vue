// カレンダー、グラフを表示するやつ
<template>
  <div>
    <v-card class="pa-3 ma-3" elevation="10">
      <v-row>
        <v-col>
          <p style="font-size: 30px">{{ formatStartTime }}</p>
        </v-col>
        <v-col>
          <p style="font-size: 30px; white-space: nowrap" align="end">
            合計 {{ totalCount }} 人
          </p>
        </v-col>
      </v-row>
      <v-switch v-model="isCheck" label="詳細表示"></v-switch>
      <Calendar :event-data="events" :calendar-start="start" />
    </v-card>
    <v-card class="pa-3 ma-3" elevation="10">
      <BarChart height="90%" :chartData="chartData" />
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import moment, { months } from "moment"; // 時間操作
import { setCalendarData, listSortCount } from "@/ts/SetCalendarData.ts"; // JSON配列をVuetifyのカレンダーに入れられるように変換する関数
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

    // 日ごと
    const eventsList = new Array<EventObject>();

    // カレンダーに入れる
    setCalendarData(jsonList, eventsList, false);

    // トータル感染者数
    let totalCount = 0;
    const paramMonth = params.month;
    const paramYear = params.year;
    if (paramMonth !== undefined && paramYear !== undefined) {
      const month = parseInt(paramMonth);
      const year = parseInt(paramYear);
      // その月のユーザーを数える
      totalCount = jsonList
        .filter((data) => {
          const calendar = moment(data.date);
          return calendar.month() === month - 1 && calendar.year() === year;
        })
        .map((data) => data.count.total) // 人数のみ
        .reduce((a, b) => a + b); // 合計を足す
    }

    return { events: eventsList, json: jsonList, totalCount: totalCount };
  },
  data: () => ({
    events: Array<EventObject>(),
    start: moment().format("YYYY-MM-DD"), // カレンダーの月を設定する場合は
    shortWeek: false,
    shortMonth: false,
    formatStartTime: moment().format("YYYY年MM月"), // h1に表示してるやつ
    month: moment().month(), // 今の月
    chartData: new Map<String, number>(),
    isCheck: false,
    json: Array<DataJSON>(), // asyncDataで読み込んだJSON
    totalCount: 0, // トータル感染者数
  }),
  watch: {
    // Swtich変更を検知
    isCheck: function () {
      // カレンダーの予定を消す
      this.events = new Array();
      setCalendarData(this.json, this.events, this.isCheck);
      if (this.isCheck) {
        // 詳細表示時
        this.events = listSortCount(this.events);
      }
    },
  },
  mounted() {
    // カレンダーの月を設定する
    this.setCalendarDate();

    // グラフにわたすデータ。なおthis.eventsは週間の値もあるので注意して
    const dateOnlyList = this.events.filter(
      (event) => event.type == "date"
    ) as EventObject[];
    dateOnlyList.forEach((json) => {
      const month = this.$route.params.month;
      const calendar = moment(json.start);
      const setCalendar = moment().set("month", parseInt(month) - 1);
      if (calendar.month() == setCalendar.month()) {
        // 同じ月
        this.chartData.set(json.start, json.count);
      }
    });
    this.chartData = new Map(this.chartData);
  },
  methods: {
    toLocaleDate(date: Date) {
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    },
    // カレンダーの月を設定する
    setCalendarDate() {
      const paramMonth = this.$route.params.month;
      const paramYear = this.$route.params.year;
      if (paramMonth !== undefined && paramYear !== undefined) {
        const month = parseInt(paramMonth);
        const year = parseInt(paramYear);
        this.start = `${year}-${month}-00`;
        this.formatStartTime = `${year}年${month}月`;
        this.month = month - 1;
        this.$store.commit(
          "setBarTitle",
          `${this.formatStartTime}のコロナカレンダー`
        );
      }
    },
  },
});
</script>