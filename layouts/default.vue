<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" :mini-variant="miniVariant" :clipped="clipped" fixed app>
      <v-list nav>
        <!-- ダークモードスイッチ -->
        <v-switch
          class="text-center ma-2 pa-2"
          :append-icon="`${$vuetify.theme.dark ? 'mdi-weather-night' : 'mdi-weather-sunny'}`"
          v-model="$vuetify.theme.dark"
          label="テーマ切り替え"
        ></v-switch>
        <v-list-item v-for="(item, i) in items" :key="i" :to="item.path" nuxt router exact>
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app color="blue">
      <v-app-bar-nav-icon class="white--text" @click.stop="drawer = !drawer" />
      <v-toolbar-title class="white--text" v-text="this.$store.state.barTitle" />
      <v-spacer />
    </v-app-bar>
    <v-main>
      <v-container fluid fill-height>
        <v-col>
          <nuxt />
        </v-col>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";

/** ナビゲーションドロワーのメニューの型定義 */
interface MenuObject {
  title: String;
  icon: String;
  path: String;
}

export default Vue.extend({
  // CSVデータを読み込む。asyncDataはlayout/default.vueでは使えなかった(pagesなら使える)
  data: () => ({
    clipped: false,
    drawer: false,
    fixed: false,
    miniVariant: false,
    right: true,
    rightDrawer: false,
    title: "コロナカレンダー",
    items: Array<MenuObject>({
      title: "全範囲グラフ",
      icon: "mdi-chart-bar",
      path: "/allchart",
    }),
  }),
  created() {
    const dataList = this.$store.state.csvData.body as any[];
    // 月の配列を生成。Setなので被りが出ない
    const monthTitleList = new Set<string>();
    for (let index = 0; index < dataList.length; index++) {
      const covid19 = dataList[index];
      const date = new Date(covid19.公表_年月日);
      monthTitleList.add(`${date.getFullYear()}/${date.getMonth() + 1}`);
    }
    // メニューに入れる
    monthTitleList.forEach((title) => {
      // オブジェクト作成
      const menuObject: MenuObject = {
        title: title,
        path: `/${title}`,
        icon: "mdi-calendar",
      };
      this.items.push(menuObject);
    });
  },
});
</script>
