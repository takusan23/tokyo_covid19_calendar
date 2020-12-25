# このサイトについて

このサイトは、[東京都 新型コロナウイルス陽性患者発表詳細
](https://catalog.data.metro.tokyo.lg.jp/dataset/t000010d0000000068)のデータをもとにカレンダー形式で表示するサイトです。  
東京都とは特に関係がありません。  
あとせっかくなのでWebサイトのソースコードも公開しておきます。

# データ更新頻度
日付が切り替わるとWebサイトが再構築されます。  
そのため今日の分が反映されるのは明日になります。

# プライバシーポリシー
## Google Analytics
このサイトではGoogle Analyticsを利用しています。  
これは、私が来訪者の人数などを確認するために利用しています。  

Google Analyticsでは、データの収集でCookieを利用しています。集めているデータは匿名で、個人が特定できるような値を集めているわけではありません。　　

 Cookieを無効化することでGoogle Analyticsの収集を拒否することができます。 詳しくはここへ→ https://policies.google.com/technologies/partner-sites?hl=ja

# ライセンス
`MIT License`

ですが、このWebサイトのライセンスとは別に[東京都 新型コロナウイルス陽性患者発表詳細
](https://catalog.data.metro.tokyo.lg.jp/dataset/t000010d0000000068)のライセンスが`クリエイティブ・コモンズ・ライセンス 表示 4.0 国際 (CC BY 4.0)`に設定されているためそちらにも従ってください。

# 開発者むけ？

## リポジトリ
https://github.com/takusan23/tokyo_covid19_calendar

## contentディレクトリ

ここのフォルダの構成

- covid19.csv
    - [東京都 新型コロナウイルス陽性患者発表詳細](https://catalog.data.metro.tokyo.lg.jp/dataset/t000010d0000000068)
    - のCSVファイル
- data.json
    - covid19.csvをJSON化した結果
    ```json
    [
        {
            "date": "2020/12/24",
            "count": {
                "20代": 240,
                "total": 888,
                "40代": 143,
                "10代": 47,
                "30代": 184,
                "50代": 121,
                "80代": 30,
                "60代": 49,
                "10歳未満": 30,
                "70代": 38,
                "90代": 6
            }
        }
    ]
    ```
- month_menu.json
    - 月のJSON配列が入ってるJSON
    ```json
    ["2020/1","2020/2","2020/3","2020/4","2020/5","2020/6","2020/7","2020/8"]
    ```

## データの取得
`download/main.js`にCSV取得とJSON変換を実行するコードが書いてあります。  
以下のコマンドでデータの更新をかけることができます。

```
npm run download
```

## ライブラリのライセンス
Webサイトのライセンスってどこに書くべきなのか知らんからここらへんに書きます。

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