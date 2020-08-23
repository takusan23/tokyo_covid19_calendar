// Vue全体で管理したい値。今回はタイトルバーのテキスト
export const state = () => ({
    barTitle: "コロナカレンダー",
    csvData: [],
    menuList: []
})

// Vuexの値はここで変更する。
export const mutations = {
    setBarTitle(state, title) {
        state.barTitle = title
    },
    setCSVData(state, list) {
        state.csvData = list
    },
    setMenuList(state, menu) {
        state.menuList = menu
    }
}

// メニューJSONを読み込む(content/menu)
export const actions = {
    async nuxtServerInit({ commit }, { req }) {
        // nuxt/contentで読み込む
        const asyncData = await this.$content("covid19").fetch()
        commit("setCSVData", asyncData)
    }
}