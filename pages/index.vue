<template>
  <v-container>
    <v-row>
      <v-col v-for="col in 12" :key="col">
        <v-card class="ma-2 pa-2" elevation="10">
          <!-- たいとる -->
          <v-toolbar dense elevation="0" style="background-color:transparent">
            <v-toolbar-title>{{ col }} 月</v-toolbar-title>
            <v-spacer></v-spacer>
            <!-- 詳細へボタン -->
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on" @click="openCalendar(col)">
                  <v-icon>mdi-open-in-new</v-icon>
                </v-btn>
              </template>
              <span>詳細へ</span>
            </v-tooltip>
          </v-toolbar>
          <!-- カレンダー -->
          <Calendar :event-data="eventData" :calendar-start="getCalendarStart(col)" />
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
  data: () => ({}),
  mounted() {
    this.$store.commit("setBarTitle", `トップ`);
  },
  methods: {
    /**
     * YYYY-MM-DD を生成する
     * @param month 1月なら1
     */
    getCalendarStart(month: number) {
      const calendar = moment()
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
      this.$router.push(calendar.format("YYYY/MM"));
    },
  },
});
</script>