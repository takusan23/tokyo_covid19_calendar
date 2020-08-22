# tokyo_covid19_calendar

カレンダーに感染者数を載せて見てみたいということで作ってみました。適当すぎる

![Imgur](https://imgur.com/zYyQyE6.png)

週間ごとの人数やばくね？

# 使った技術的な
- 東京都 新型コロナウイルス陽性患者発表詳細
    - https://catalog.data.metro.tokyo.lg.jp/dataset/t000010d0000000068
- TypeScript
    - なんかあんま恩恵受けれてない
- Nuxt.js
    - 静的サイト書き出しが付いたVue.js
    - nuxt/contentでCSVデータを読み込んでる
- Vuetify
    - カレンダー、メニューなどのUI
- Chart.js
    - グラフ表示
- Moment.js
    - 時間操作。
    - 指定した日の週の日曜日、土曜日の日付を取得するのに使った。
- Koruriフォント
    - https://koruri.github.io/

# 仕組み
`nuxt/content`モジュールを利用して、[東京都 新型コロナウイルス陽性患者発表詳細](https://catalog.data.metro.tokyo.lg.jp/dataset/t000010d0000000068)のCSVデータを読み込みます。

読み込むとJavaScript上で扱いやすい形式へ変換してくれます。

![Imgur](https://imgur.com/89DxYFw.png)

あとはVuetifyのカレンダーで表示できるように変換したりしてます。

# 実行方法

## 必要なもの

- Node.js
- VSCode
    - 宗教的に使えないなら別にいい

## 一回目 もしくは CSVデータの更新をしたい場合
初回実行時は [仕組み](#仕組み) のところでCSVデータを読み込むと書きました。そのCSVデータを取りに行く必要があります。

```
npm run download
```

少し待つと、`content/covid19.csv`にファイルがダウンロードされます。

そしたら

```
npm run dev
```

してください。

## 二回目以降（CSVデータの更新が必要ない場合）
```
npm run dev
```

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