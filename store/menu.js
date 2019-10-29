
function setMenu (state, payLoad){
  if(!state.items.length)
    state.items = payLoad
}

export const state = () => ({ items: [] })

export const mutations = { set: setMenu }
