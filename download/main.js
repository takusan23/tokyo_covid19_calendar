/** 
 * 東京都 新型コロナウイルス陽性患者発表詳細のCSVデータをダウンロードする
 * node.js
 * https://stopcovid19.metro.tokyo.lg.jp/data/130001_tokyo_covid19_patients.csv
 */
// 主役
const https = require("https")
// ファイル保存するのに使う
const fs = require("fs")

/**
 * CSVファイルを月ごとのJSON配列に変換して保存する
 * こんなの：
 * ["2020/1","2020/2","2020/3","2020/4","2020/5","2020/6","2020/7","2020/8"]
 */
const csvFileToMenuJSON = () => {
    let returnList = []
    let isFirst = true
    fs.readFile("content/covid19.csv", (err, data) => {
        // CSVファイル読み出し
        const csvFile = data.toString()
        // 改行コードで配列分割
        csvFile.split("\n").forEach(line => {
            // 一行ごとに処理
            // 二回目以降
            if (!isFirst) {
                // 配列分割
                const splitList = line.split(",")
                // 同じ月
                const calendar = new Date(splitList[4])
                // Nanになる？
                if (!isNaN(calendar.getFullYear())) {
                    const yearMonth = `${calendar.getFullYear()}/${calendar.getMonth() + 1}`
                    if (returnList.indexOf(yearMonth) === -1) {
                        // ない場合
                        returnList.push(yearMonth)
                    } else {
                        // あるなら無視
                    }
                }
            } else {
                // 最初は飛ばす
                isFirst = false
            }
        })
        // 保存する
        fs.writeFileSync('content/month_menu.json', JSON.stringify(returnList), { encoding: "utf-8" }, (err) => {
            if (err) {
                console.log("失敗したわ")
            }
        })
    })
}

/**
 * CSVファイルをJSON化する
 * こんなの：
 * [
 *      {
 *          "date": "2020/8/22",
 *          "count": {
 *              "20代": 100,
 *              "total": 256,
 *              "30代": 64,
 *              "40代": 30,
 *              "50代": 25,
 *              "60代": 12,
 *              "10代": 5,
 *              "70代": 6,
 *              "80代": 10,
 *              "10歳未満": 4
 *          }
 *      }
 * ]
 */
const csvFileToJSON = () => {
    let returnMap = new Map() // 月-人数 のMap
    fs.readFile("content/covid19.csv", (err, data) => {
        // CSVファイル読み出し
        const csvFile = data.toString()
        // 改行コードで配列分割
        csvFile.split("\n").forEach(line => {
            // 配列分割
            const splitList = line.split(",")
            const calendar = new Date(splitList[4])
            // Nanになる？
            if (!isNaN(calendar.getMonth())) {
                // 同じ月
                const yearMonth = `${calendar.getFullYear()}/${calendar.getMonth() + 1}/${calendar.getDate()}`
                const key = splitList[8]
                // まとめて数える
                if (returnMap.has(yearMonth)) {
                    // カウントを増やす
                    const object = returnMap.get(yearMonth)
                    if (object[key] !== undefined) {
                        // キーが有る場合
                        object[key]++
                    } else {
                        // ない場合
                        object[key] = 1
                    }
                    // 合計出す
                    object["total"]++
                    returnMap.set(yearMonth, object)
                } else {
                    // ない
                    const object = {}
                    object[key] = 1 // 変数をキーにする
                    object["total"] = 1 // 合計
                    returnMap.set(yearMonth, object)
                }
            }
        })
        // MapをJSON化する
        const jsonList = []
        returnMap.forEach((value, key) => {
            jsonList.push({
                date: key,
                count: value
            })
        })
        // 保存する
        fs.writeFileSync('content/data.json', JSON.stringify(jsonList), { encoding: "utf-8" }, (err) => {
            if (err) {
                console.log("失敗したわ")
            }
        })
    })
}


// うらる
const options = {
    hostname: "stopcovid19.metro.tokyo.lg.jp",
    method: "GET",
    path: "/data/130001_tokyo_covid19_patients.csv",
    port: 443,
    headers: { 'User-Agent': 'TokyoCovid19Calendar@takusan_23' }
};
// 結果
let response = ""
// 取りに行く
const request = https.get(options, (res) => {
    res.setEncoding('utf-8')
    res.on("data", (text) => {
        // レスポンスをつなげる
        response += text
    })
    res.on("end", () => {
        // 取得完了。保存する
        // CSVファイルはnuxt/contentモジュールで使えるようになる
        fs.writeFile('content/covid19.csv', response, { encoding: "utf-8" }, (err) => {
            // 終了したらJSON保存
            csvFileToMenuJSON()
            csvFileToJSON()
            if (err) {
                console.log("失敗したわ")
            }
        })
    })
    res.on("error", () => {
        console.log("コケた")
    })
})
request.end()