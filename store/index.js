// Vue全体で管理したい値。今回はタイトルバーのテキスト
export const state = () => ({
    barTitle: "コロナカレンダー",
})

// Vuexの値はここで変更する。
export const mutations = {
    setBarTitle(state, title) {
        state.barTitle = title
    },
}