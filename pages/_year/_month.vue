// カレンダー、グラフを表示するやつ
<template>
  <div>
    <v-card class="pa-3 ma-3" elevation="10">
      <p style="font-size:30px">{{formatStartTime}}</p>
      <v-calendar
        ref="calendar"
        :event-color="getEventColor"
        :events="events"
        :start="start"
        :short-months="shortMonth"
        :short-weekdays="shortWeek"
        color="primary"
        type="month"
      ></v-calendar>
    </v-card>
    <v-card class="pa-3 ma-3" elevation="10">
      <BarChart height="90%" :chartData="chartData" />
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import moment, { months } from "moment"; // 時間操作
import Chart from "chart.js"; // グラフ
import BarChart from "../../components/BarChart.vue"; // グラフ。そういえばcomponent:{}書かずに済むようになったの？

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
    events: Array<EventObject>(),
    start: moment().format("YYYY-MM-DD"), // カレンダーの月を設定する場合は
    shortWeek: false,
    shortMonth: false,
    formatStartTime: moment().format("YYYY年MM月"), // h1に表示してるやつ
    month: moment().month(), // 今の月
    chartData: new Map<String, number>(),
  }),
  mounted() {
    // もし時刻を指定している場合は
    this.setCalendarDate();

    // 日付と感染者数のMap
    const dayCountMap = new Map<string, number>();
    // Vuex Storeから取り出す
    const csvData = this.$store.state.csvData.body as any[];
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
    });
    // this.events配列に格納
    dayCountMap.forEach((value, key) => {
      // 次の日に変わった
      const event: EventObject = {
        name: `${value} 人`,
        count: value,
        start: key.toString(),
        type: "date",
      };
      this.events.push(event);
    });
    // 一週間ごとの 何週目 と カレンダーに入れるオブジェクト のMap
    const weekCountMap = new Map<number, EventObject>();
    // 一日ごとの配列を使って一週間ごとに
    this.events.forEach((item) => {
      // moment.jsの恩恵を受ける
      const calendar = moment(item.start.toString());
      const startCalendar = calendar.day("Sunday").clone(); // 日曜日の日付を取得。これできるの有能では
      const endCalendar = calendar.day("Sataday").clone(); // 土曜日の日付を取得
      // （年間）何週目か
      const calcWeek = calendar.week();
      // すでにある場合は
      if (weekCountMap.has(calcWeek)) {
        // キーが有る場合はカウントを増やす
        const event = weekCountMap.get(calcWeek)!!;
        const data: EventObject = {
          name: `${event.count + item.count} 人`,
          count: event.count + item.count,
          start: event.start,
          end: event.end,
          type: "week",
        };
        weekCountMap.set(calcWeek, data);
      } else {
        const data: EventObject = {
          name: `${item.count} 人`,
          count: item.count,
          start: startCalendar.format("YYYY-MM-DD"),
          end: endCalendar.format("YYYY-MM-DD"),
          type: "week",
        };
        // 無いので作成
        weekCountMap.set(calcWeek, data);
      }
    });
    // this.events配列に格納
    weekCountMap.forEach((value, key) => {
      this.events.push(value);
    });

    // グラフ用意
    this.chartData = this.getDayCountMapFilterNowMonth(this.month, dayCountMap);
  },
  methods: {
    toLocaleDate(date: Date) {
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    },
    // 色を設定する。eventは予定オブジェクト
    getEventColor(event: EventObject) {
      let color = "orange";
      if (event.type == "date") {
        color = "blue";
      }
      return color;
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
    // 指定した月の値だけ返す
    getDayCountMapFilterNowMonth(month: number, monthMap: Map<String, number>) {
      const returnMap = new Map<String, number>();
      monthMap.forEach((value, key) => {
        const calendar = moment(key.toString());
        const setCalendar = moment().set("month", month);
        if (calendar.month() == setCalendar.month()) {
          // 同じ月
          returnMap.set(key, value);
        }
      });
      return returnMap;
    },
  },
});
</script>