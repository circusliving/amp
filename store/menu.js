
function setMenu (state, payLoad) {
  state.items = payLoad
}

export const state = () => ({
  items: []
})

export const mutations = {
  set: setMenu
}
