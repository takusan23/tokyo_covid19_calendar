<template>
  <v-container>

    <v-card class="ma-1 pa-1" color="primary">
      <v-card-title class="white--text">2020年</v-card-title>
    </v-card>

    <v-row>
      <v-col v-for="col in 12" :key="col">
        <v-card class="ma-2 pa-2" elevation="10">
          <!-- たいとる -->
          <v-toolbar dense elevation="0" style="background-color: transparent">
            <v-toolbar-title>{{ col }} 月</v-toolbar-title>
            <v-spacer></v-spacer>
            <!-- 詳細へボタン -->
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on" link :to="openCalendar(col)">
                  <v-icon>mdi-open-in-new</v-icon>
                </v-btn>
              </template>
              <span>詳細へ</span>
            </v-tooltip>
          </v-toolbar>
          <!-- カレンダー -->
          <Calendar
            :event-data="eventData"
            :calendar-start="getCalendarStart(2020, col)"
          />
        </v-card>
      </v-col>
    </v-row>

    <v-card class="ma-1 pa-1" color="primary">
      <v-card-title class="white--text">2021年</v-card-title>
    </v-card>

    <v-row>
      <v-col v-for="col in 12" :key="col">
        <v-card class="ma-2 pa-2" elevation="10">
          <!-- たいとる -->
          <v-toolbar dense elevation="0" style="background-color: transparent">
            <v-toolbar-title>{{ col }} 月</v-toolbar-title>
            <v-spacer></v-spacer>
            <!-- 詳細へボタン -->
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on" link :to="openCalendar(col)">
                  <v-icon>mdi-open-in-new</v-icon>
                </v-btn>
              </template>
              <span>詳細へ</span>
            </v-tooltip>
          </v-toolbar>
          <!-- カレンダー -->
          <Calendar
            :event-data="eventData"
            :calendar-start="getCalendarStart(2021, col)"
          />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import moment from "moment";
import { EventObject, DataJSON, CountJSON } from "@/ts/ObjectType.ts"; // 型読み込み
import { setCalendarData } from "@/ts/SetCalendarData.ts"; // JSON配列をVuetifyのカレンダーに入れられるように変換する関数

export default Vue.extend({
  async asyncData({ $content }) {
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
    // 配列に入れる関数
    setCalendarData(jsonList, eventsList, false);

    return { eventData: eventsList };
  },
  data: () => ({
    title: "トップ",
  }),
  mounted() {
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
  methods: {
    /**
     * YYYY-MM-DD を生成する
     * @param year 2020とか2021とか
     * @param month 1月なら1
     */
    getCalendarStart(year: number, month: number) {
      const calendar = moment()
        .year(year)
        .month(month - 1)
        .date(1);
      return calendar.format("YYYY-MM-DD");
    },
    /**
     * 各カレンダーを開く
     */
    openCalendar(month: number) {
      const calendar = moment()
        .month(month - 1)
        .date(1);
      return calendar.format("/YYYY/M");
    },
  },
});
</script>
