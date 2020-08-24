/**
 * TypeScript用の型定義
 * 使用例
 * import { EventObject, DataJSON, CountJSON } from "@/ts/ObjectType.ts"; // 分割代入
 * const jsonList = new Array<DataJSON>() // DataJSONの配列
 */

/** カレンダーに入れるオブジェクトの型定義。本当は外に置くべき？ */
export interface EventObject {
    /** @param name カレンダーに入れるテキスト */
    name: string;
    /** @param type 日か週 */
    type: "date" | "week";
    /** 件数 */
    count: number;
    /** 開始時間 か 日をまたがない場合は日付 */
    start: string;
    /** 日をまたいだときの終わりの日付。跨がない場合はnull */
    end?: string;
    /** 年齢。詳細表示以外では存在しない。30代など */
    old?: string;
}

/** content/data.json の型 */
export interface DataJSON {
    /** @param date 日付。YYYY/MM/DD */
    date: string;
    /** 感染者数 */
    count: CountJSON;
}

/** content/data.json のcontentオブジェクトの型 */
export interface CountJSON {
    /** トータル人数。他にも20代とかある */
    total: number;
}
