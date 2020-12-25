import colors from 'vuetify/es5/util/colors'

// data.json読み込むのに使う
const fs = require("fs").promises

export default {
  /*
  ** Nuxt rendering mode
  ** See https://nuxtjs.org/api/configuration-mode
  */
  mode: 'universal',
  /*
  ** Nuxt target
  ** See https://nuxtjs.org/api/configuration-target
  */
  target: 'static',
  /*
  ** Headers of the page
  ** See https://nuxtjs.org/api/configuration-head
  */
  head: {
    titleTemplate: '%s - ' + '東京コロナカレンダー',
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '東京都のコロナウイルス感染者をカレンダーに表示する非公式サイトです。' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Global CSS
  */
  css: [
    { src: '~assets/css/styles.css' }
  ],
  /*
  ** Plugins to load before mounting the App
  ** https://nuxtjs.org/guide/plugins
  */
  plugins: [
  ],
  /*
  ** Auto import components
  ** See https://nuxtjs.org/api/configuration-components
  */
  components: true,
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxt/typescript-build',
    '@nuxtjs/vuetify',
    '@nuxtjs/google-analytics',
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/pwa',
    // Doc: https://github.com/nuxt/content
    '@nuxt/content',
    '@nuxtjs/sitemap',
  ],
  /*
  ** Content module configuration
  ** See https://content.nuxtjs.org/configuration
  */
  content: {},
  /*
  ** vuetify module configuration
  ** https://github.com/nuxt-community/vuetify-module
  */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    // フォント適用のために。ビルドおそすぎる場合はfalseでも良いよ
    treeShake: true,
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },
  /*
  ** Build configuration
  ** See https://nuxtjs.org/api/configuration-build/
  */
  build: {
  },
  /** 
 * PWA manifest.json
 */
  manifest: {
    name: '東京コロナカレンダー',
    title: '東京コロナカレンダー',
    short_name: '東京コロナカレンダー',
    'og:title': '東京コロナカレンダー',
    lang: 'ja',
    display: 'standalone',
    shortcuts: [
      {
        name: "全範囲グラフ",
        short_name: "全範囲グラフ",
        description: "全範囲グラフを開きます",
        url: "/allchart"
      }
    ]
  },
  /**
 * サイトマップ書き出し
 */
  sitemap: {
    hostname: 'https://tokyo-covid19-calendar.netlify.app/',
    routes: async () => {
      // 月一覧読み出し
      const dataJSON = await fs.readFile('./content/month_menu.json', 'utf-8')
      // 日付だけの配列へ
      return Array.from(JSON.parse(dataJSON))
    }
  },
  /** 
   * Google アナリティクス
   * 
   * ユニバーサル アナリティクス プロパティのスイッチをONにしないと、従来のUA-から始まるIDが生成されない。
   */
  googleAnalytics: {
    id: 'UA-149954537-3'
  }
}
