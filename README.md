# tokyo_covid19_calendar

[![Netlify Status](https://api.netlify.com/api/v1/badges/a4791628-eec0-426a-b8ba-b0bb4da09cd3/deploy-status)](https://app.netlify.com/sites/tokyo-covid19-calendar/deploys)

カレンダーに感染者数を載せて見てみたいということで作ってみました。適当すぎる

![Imgur](https://imgur.com/zYyQyE6.png)

週間ごとの人数やばくね？

https://tokyo-covid19-calendar.netlify.app/

# 使った技術的な
- 東京都 新型コロナウイルス陽性患者発表詳細
    - https://catalog.data.metro.tokyo.lg.jp/dataset/t000010d0000000068
- TypeScript
    - なんかあんま恩恵受けれてない
    - `as any`しまくっているのでどうにかしたい。
- Nuxt.js
    - 静的サイト書き出しが付いたVue.js
- Vuetify
    - カレンダー、メニューなどのUI
- Chart.js
    - グラフ表示
- Moment.js
    - 時間操作。
    - 指定した日の週の日曜日、土曜日の日付を取得するのに使った。
- Koruriフォント
    - https://koruri.github.io/
- Googleアナリティクス
    - 来訪者数など
- Google Search Console
    - サイトマップの送信など
    - Netlifyのsnippet injectionってやつで必要なmetaタグを差し込んでます。

# 仕組み

- `npm run download`を実行して、CSVデータをJSON形式へ変換します
    - `content/data.json`と`content/month_menu.json`を生成します
    - なお`.gitignore`に追記してるのでこの2つは見れないです。
- `content/data.json`を`nuxt/content`モジュールを利用して読み込みます
    - `pages/_year/_month.vue`参照

## GitHub Actions
を利用して、NetlifyのWebHookを毎日朝九時に送るようにしてます（多分）

GitHub Actionsについては自作ブログでちょっと書いた：https://takusan.negitoro.dev/posts/github_actions

# 実行方法

## 必要なもの

- Node.js
- VSCode
    - 宗教的に使えないなら別にいい

## 一回目 もしくは データの更新をしたい場合
`/content/data.json`と`/content/month_menu.json`を取得する必要があるので、

```
npm run download
```

少し待つと、`/content/covid19.csv`、`/content/data.json`、`content/month_menu.json`が生成されます。  

詳細は`/download/main.js`参照

そしたら

```
npm run dev
```

してください。

なのでNetlifyのコマンドは  
`npm run download && npm run generate`  
になっている。

## 二回目以降（データの更新が必要ない場合）
```
npm run dev
```

## 静的()サイト書き出し
Nuxt.jsなのでHTMLファイルに書き出すことができます。

```
npm run generate
```

### 静的サイト書き出し確認
静的サイトの書き出し結果を確認することができます(Nuxt.jsの機能)

```
npx nuxt serve
```


# ファイル構成
- assets
    - フォントファイルやCSS、SCSS（Vuetify上書き用）がおいてあります
- components
    - グラフ表示コンポーネントがあります
    - AndroidのカスタムView的な
- content
    - 東京都 新型コロナウイルス陽性患者発表詳細 のCSVデータを置きます
- download
    - これはNuxt.jsの物じゃないです。
    - 東京都 新型コロナウイルス陽性患者発表詳細 のCSVデータをダウンロードするJavaScriptファイルがあります
- layout
    - pagesを乗せるやつ。アプリのバーなどはここ
    - AndroidのActivity的な
- middleware
    - ？
- pages
    - _year/_month.vue
        - カレンダーとグラフを表示する
    - layoutに乗せる
    - AndroidのFragment的な
- plugins
    - ？
- static
    - 画像とかおいてある
- store
    - Nuxt.jsアプリで値を共有できるVuexのJSがおいてある
- ts
    - TypeScriptのInterfaceとか`ObjectType.ts`、JSON配列を変換するコード（`SetCalendarData.ts`）がおいてある。他でも使うので切り出した。

# オープンソースライセンス
- 東京都 新型コロナウイルス陽性患者発表詳細
    - https://catalog.data.metro.tokyo.lg.jp/dataset/t000010d0000000068
    - CC BY 4.0
- Nuxt.js
    - MIT License
- Vuetify
    - MIT License
- Chart.js
    - MIT License
- moment.js
    - MIT License
- Koruriフォント
    - Apache License v2.0