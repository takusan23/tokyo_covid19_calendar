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

// CSVデータを読み込む。asyncDataはlayout/default.vueでは使えなかった(pagesなら使える)
export const actions = {
    async nuxtServerInit({ commit }, { req }) {
        // nuxt/contentで読み込む
        const asyncData = await this.$content("covid19").fetch()
        commit("setCSVData", asyncData)
    }
}