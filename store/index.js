// Vue全体で管理したい値。今回はタイトルバーのテキスト
export const state = () => ({
    barTitle: "コロナカレンダー",
    csvData: []
})

// Vuexの値はここで変更する。
export const mutations = {
    setBarTitle(state, title) {
        state.barTitle = title
    },
    setCSVData(state, list) {
        state.csvData = list
    }
}