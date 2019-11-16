import latestArticles    from '~/apollo/latestArticles'

export const state     = () => ({ latest: [] })
export const actions   = { latest }
export const getters   = { latestArticle }
export const mutations = { setLatest, setByTag }

function latestArticle(state){ return state.latest }

function setLatest (state, payLoad){ state.latest = payLoad }

function setByTag (state, { tag, articles }){
  state[tag] = articles
}

async function latest ({ commit  }){
  const articles = (await this.app.apolloProvider.defaultClient.query({
    query: latestArticles
  })).data.allArticles

  commit('setLatest', articles)
}

