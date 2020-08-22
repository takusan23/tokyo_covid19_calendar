/** 
 * 東京都 新型コロナウイルス陽性患者発表詳細のCSVデータをダウンロードする
 * node.js
 * https://stopcovid19.metro.tokyo.lg.jp/data/130001_tokyo_covid19_patients.csv
 */
// 主役
const https = require("https")
// ファイル保存するのに使う
const fs = require("fs")
// うらる
const URL = "https://stopcovid19.metro.tokyo.lg.jp/data/130001_tokyo_covid19_patients.csv"
const options = {
    url: URL,
    headers: { 'User-Agent': 'TokyoCovid19Calendar@takusan_23' }
};
// 結果
let response = ""
// 取りに行く
const request = https.get(URL, (res) => {
    res.setEncoding('utf-8')
    res.on("data", (text) => {
        // レスポンスをつなげる
        response += text
    })
    res.on("end", () => {
        // 取得完了。保存する
        // CSVファイルはnuxt/contentモジュールで使えるようになる
        fs.writeFileSync('content/covid19.csv', response, { encoding: "utf-8" }, (err) => {
            if (err) {
                console.log("失敗したわ")
            } else {
                console.log("おわったよ")
            }
        })
    })
    res.on("error", () => {
        console.log("コケた")
    })
})
request.end()