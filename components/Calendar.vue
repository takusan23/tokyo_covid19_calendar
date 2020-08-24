<template>
  <!-- カレンダーコンポーネント。propsには -->
  <!-- event-data で EventObject 配列を入れてください。 pages/_year/_month.vue 参照 -->
  <!-- calendar-start を入れるとカレンダーの月を変更できます。 YYYY-MM-DD 形式で頼む -->
  <v-calendar
    ref="calendar"
    :event-color="getEventColor"
    :events="eventData"
    :start="calendarStart"
    :short-months="shortMonth"
    :short-weekdays="shortWeek"
    color="primary"
    type="month"
  ></v-calendar>
</template>

<script lang="ts">
import Vue from "vue";
import moment from "moment";
import { EventObject, DataJSON, CountJSON } from "@/ts/ObjectType.ts"; // 型定義

export default Vue.extend({
  data: () => ({
    shortWeek: false,
    shortMonth: false,
    formatStartTime: moment().format("YYYY年MM月"), // h1に表示してるやつ
    month: moment().month(), // 今の月
    isCheck: false,
  }),
  props: ["event-data", "calendar-start"],
  methods: {
    // 色を設定する。eventは予定オブジェクト
    getEventColor(event: EventObject) {
      let color = "orange";
      if (event.type == "date") {
        color = "blue";
      }
      // 詳細表示時
      if (event.old !== undefined) {
        switch (event.old) {
          case "10歳未満":
            color = "purple";
            break;
          case "20代":
            color = "red";
            break;
          case "30代":
            color = "indigo";
            break;
          case "40代":
            color = "cyan";
            break;
          case "50代":
            color = "teal";
            break;
          case "60代":
            color = "green";
            break;
          case "70代":
            color = "lime";
            break;
          case "80代":
            color = "brown";
            break;
          case "90代":
            color = "blue-grey";
            break;
          case "100歳以上":
            color = "grey";
            break;
        }
      }
      return color;
    },
  },
});
</script>