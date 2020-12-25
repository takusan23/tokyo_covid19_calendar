<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list nav>
        <!-- ダークモードスイッチ -->
        <v-switch
          class="text-center ma-2 pa-2"
          :append-icon="`${
            $vuetify.theme.dark ? 'mdi-weather-night' : 'mdi-weather-sunny'
          }`"
          v-model="$vuetify.theme.dark"
          label="テーマ切り替え"
        ></v-switch>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.path"
          nuxt
          router
          exact
        >
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
      <v-toolbar-title
        class="white--text"
        v-text="this.$store.state.barTitle"
      />
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
// メニューJSON
import menuJSON from "../content/month_menu.json";

/** ナビゲーションドロワーのメニューの型定義 */
interface MenuObject {
  title: String;
  icon: String;
  path: String;
}

export default Vue.extend({
  data: () => ({
    clipped: false,
    drawer: false,
    fixed: false,
    miniVariant: false,
    right: true,
    rightDrawer: false,
    title: "コロナカレンダー",
    items: Array<MenuObject>(
      {
        title: "トップ",
        icon: "mdi-calendar-multiple",
        path: "/",
      },
      {
        title: "全範囲グラフ",
        icon: "mdi-chart-bar",
        path: "/allchart",
      },
      {
        title: "月ごとのグラフ",
        icon: "mdi-chart-bar",
        path: "/monthchart",
      },
      {
        title: "このサイトについて",
        icon: "mdi-information-outline",
        path: "/about",
      }
    ),
  }),
  created() {
    menuJSON.reverse().forEach((menu) => {
      const menuObj: MenuObject = {
        title: menu,
        icon: "mdi-calendar",
        path: `/${menu}`,
      };
      // このサイトについて を一番下に持っていきたいのでちょっと修正
      this.items.splice(3, 0, menuObj);
    });
  },
});
</script>
