import allWebPages    from '~/apollo/allWebPages'
import clone          from 'lodash.clone'


export const state = () => ({})

export const actions = {
  async nuxtServerInit ({ commit }, { app }) {
    commit('menu/set', await getPages(app))
  }
}

async function getPages ({apolloProvider}) {
  let pages = (await apolloProvider.defaultClient.query({
    query: allWebPages
  })).data.allWebPages

  return makeTree(pages)
}

function makeTree (pages) {
  let pagesClone = clone(pages)
  let home       = pagesClone.shift()
  let webPages   = []                  // home page

  while (pagesClone.length > 0) {

    let page = pagesClone.shift()

    if (isTopLevel(page)) {
      webPages.push(page)
      continue
    }

    insertChild (webPages, page)
  }
  webPages = sortMenu(webPages)
  webPages.push(home)
  return webPages
}

function insertChild (webPages, page) {
  for (let i = 0; i < webPages.length; i++) 
    if (isParent(webPages[i].path, page.path)) { 
      
      if (!Array.isArray(webPages[i].nodes)) webPages[i].nodes = []

      webPages[i].nodes.push(page)
    }
}

function sortMenu (webPages) {
  webPages = webPages.sort(compare)
  
  for (let i = 0; i < webPages.length; i++) 
    if (Array.isArray(webPages[i].nodes))
      webPages[i].nodes = webPages[i].nodes.sort(compare)

  return webPages
}

function compare (a, b) {
  if (!Number.isInteger(a.order)) a.order = 0
  if (!Number.isInteger(b.order)) b.order = 0
  
  return a.order - b.order;
}

function isParent (parent, child) {
  let path = child.replace(parent,'')

  return isTopLevel ({ path: path })
}

function isTopLevel ({path}) {
  let pathArr = path.split('/')
  pathArr.shift() // remove empty string 

  return (pathArr.length === 1)
}

