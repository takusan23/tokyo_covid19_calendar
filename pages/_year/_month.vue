// カレンダー、グラフを表示するやつ
<template>
  <div>
    <v-card class="pa-3 ma-3" elevation="10">
      <p style="font-size:30px">{{formatStartTime}}</p>
      <v-switch v-model="isCheck" label="詳細表示"></v-switch>
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

/** カレンダーに入れるオブジェクトの型定義。本当は外に置くべき？ */
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
  /** 年齢。詳細表示以外では存在しない。30代など */
  old?: string;
}

/** content/data.json の型 */
interface DataJSON {
  /** @param date 日付。YYYY/MM/DD */
  date: string;
  /** 感染者数 */
  count: CountJSON;
}

/** content/data.json のcontentオブジェクトの型 */
interface CountJSON {
  /** トータル人数。他にも20代とかある */
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

    // 日ごと
    const eventsList = new Array<EventObject>();

    // カレンダーに入れる
    setCalendarData(jsonList, eventsList, false);

    return { events: eventsList, json: jsonList };
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
  }),
  watch: {
    // Swtich変更を検知
    isCheck: function () {
      // カレンダーの予定を消す
      this.events = new Array();
      setCalendarData(this.json, this.events, this.isCheck);
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
  },
});

/**
 * DataJSONの配列をカレンダーにセットする
 * @param sourceList 元のJSON
 * @param eventsList カレンダーに入れるイベントの配列。:events
 * @param isAdvancedMode 詳細表示を利用する場合
 */
const setCalendarData = (
  sourceList: Array<DataJSON>,
  eventsList: Array<EventObject>,
  isAdvancedMode: boolean
) => {
  sourceList.forEach((data) => {
    if (data.date !== undefined) {
      const calendar = moment(data.date);
      // 詳細表示？
      if (isAdvancedMode) {
        // 詳細表示？
        Object.keys(data.count).forEach((key) => {
          // キーを取り出す。as any どうにかしたい
          const keyValue = (data.count as any)[key];
          const event: EventObject = {
            name: `${key}：${keyValue} 人`,
            count: keyValue,
            start: moment(data.date).format("YYYY-MM-DD"),
            type: "date",
            old: key,
          };
          eventsList.push(event);
        });
      } else {
        const event: EventObject = {
          name: `${data.count.total} 人`,
          count: data.count.total,
          start: moment(data.date).format("YYYY-MM-DD"),
          type: "date",
        };
        eventsList.push(event);
      }
    }
  });

  // 一週間ごとの 何週目-年齢文字列 と カレンダーに入れるオブジェクト のMap
  // 5-20代 to 5
  const weekCountMap = new Map<string, EventObject>();
  // 一日ごとの配列を使って一週間ごとに
  eventsList.forEach((item) => {
    // moment.jsの恩恵を受ける
    const calendar = moment(item.start);
    const startCalendar = calendar.day("Sunday").clone(); // 日曜日の日付を取得。これできるの有能では
    const endCalendar = calendar.day("Sataday").clone(); // 土曜日の日付を取得
    // （年間）何週目か
    const calcWeek = calendar.week();

    // すでにある場合は
    if (weekCountMap.has(`${calcWeek}-${item.old}`)) {
      // キーが有る場合はカウントを増やす
      const event = weekCountMap.get(`${calcWeek}-${item.old}`)!!;
      const data: EventObject = {
        name: `${event.count + item.count} 人`,
        count: event.count + item.count,
        start: event.start,
        end: event.end,
        type: "week",
      };
      // 詳細表示時
      if (isAdvancedMode) {
        data.name = `${item.old}：${data.count} 人`;
      }
      weekCountMap.set(`${calcWeek}-${item.old}`, data);
    } else {
      const data: EventObject = {
        name: `${item.count} 人`,
        count: item.count,
        start: startCalendar.format("YYYY-MM-DD"),
        end: endCalendar.format("YYYY-MM-DD"),
        type: "week",
      };
      // 詳細表示時
      if (isAdvancedMode) {
        data.name = `${item.old}：${data.count} 人`;
      }
      // 無いので作成
      weekCountMap.set(`${calcWeek}-${item.old}`, data);
    }
  });
  // this.events配列に格納
  weekCountMap.forEach((value, key) => {
    eventsList.push(value);
  });
};
</script>