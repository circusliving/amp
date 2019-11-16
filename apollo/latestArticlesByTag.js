import gql from 'graphql-tag'

export default gql`{
  allArticles(first: 5, orderBy: _firstPublishedAt_DESC, filter: {tags: {anyIn: "731168"}}) {
    url
    name
    image
    jsonLd(markdown: false)
  }
}`