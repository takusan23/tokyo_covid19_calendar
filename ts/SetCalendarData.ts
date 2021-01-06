/**
 * かた
 */
import { EventObject, DataJSON } from "@/ts/ObjectType.ts";

/** 時間操作 */
import moment from "moment";

/**
 * JSONをVuetifyのカレンダーで使う配列に変換する。
 * @param sourceList 元のJSON
 * @param eventsList カレンダーに入れるイベントの配列。:events
 * @param isAdvancedMode 詳細表示を利用する場合
 */
export const setCalendarData = (
    sourceList: Array<DataJSON>,
    eventsList: Array<EventObject>,
    isAdvancedMode: boolean
) => {
    sourceList.forEach((data) => {
        if (data.date !== undefined) {
            // 詳細表示？
            if (isAdvancedMode) {
                // 詳細表示？
                Object.keys(data.count).forEach((key) => {
                    // キーを取り出す。as any どうにかしたい
                    const keyValue = (data.count as any)[key];
                    // パーセントを出す
                    const par = (((keyValue as number) / data.count.total) * 100).toFixed(2)
                    const event: EventObject = {
                        name: `${key}：${keyValue} 人 (${par} %)`,
                        count: keyValue,
                        start: moment(data.date).format("YYYY-MM-DD"),
                        type: "date",
                        old: key,
                    };
                    eventsList.push(event);
                });
            } else {
                const event: EventObject = {
                    name: `${data.count.total} 人`,
                    count: data.count.total,
                    start: moment(data.date).format("YYYY-MM-DD"),
                    type: "date",
                };
                eventsList.push(event);
            }
        }
    });

    // 一週間ごとの 何週目-年齢文字列 と カレンダーに入れるオブジェクト のMap
    // 5-20代 to 5
    const weekCountMap = new Map<string, EventObject>();
    // 一日ごとの配列を使って一週間ごとに
    eventsList.forEach((item) => {
        // moment.jsの恩恵を受ける
        const calendar = moment(item.start);
        
        // 週初めの日付
        const startCalendar = calendar.day("Sunday").clone(); // 日曜日の日付を取得。これできるの有能では
        const endCalendar = calendar.day("Sataday").clone(); // 土曜日の日付を取得
        // （年間）何週目か
        const calcWeek = calendar.week();
        // すでにある場合は
        if (weekCountMap.has(`${calcWeek}-${item.old}`)) {
            // キーが有る場合はカウントを増やす
            const event = weekCountMap.get(`${calcWeek}-${item.old}`)!!;
            // パーセントだす
            const data: EventObject = {
                name: `${event.count + item.count} 人`,
                count: event.count + item.count,
                start: event.start,
                end: event.end,
                old: item.old,
                type: "week",
            };
            // 詳細表示時
            if (isAdvancedMode) {
                data.name = `${item.old}：${data.count} 人`;
            }
            weekCountMap.set(`${calcWeek}-${item.old}`, data);
        } else {
            const data: EventObject = {
                name: `${item.count} 人`,
                count: item.count,
                start: startCalendar.format("YYYY-MM-DD"),
                end: endCalendar.format("YYYY-MM-DD"),
                old: item.old,
                type: "week",
            };
            // 詳細表示時
            if (isAdvancedMode) {
                data.name = `${item.old}：${data.count} 人`;
            }
            // 無いので作成
            weekCountMap.set(`${calcWeek}-${item.old}`, data);
        }
    });
    // this.events配列に格納
    weekCountMap.forEach((value, key) => {
        eventsList.push(value);
    });
};

/**
 * 多い順に並び替える
 * @param eventsList EventObjectの配列
 */
export const listSortCount = (eventsList: Array<EventObject>): Array<EventObject> => {
    // 多い順に並び替える。Kotlinとはまた別な感じに
    return eventsList.sort((a, b) => b.count - a.count)
}

/**
 * 日付順に並び替える
 * @param eventsList EventObjectの配列
 */
export const listSortDate = (eventsList: Array<EventObject>): Array<EventObject> => {
    // 多い順に並び替える。Kotlinとはまた別な感じに
    return eventsList.sort((a, b) => b.count - a.count)
}
