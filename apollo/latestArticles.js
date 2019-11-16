import gql from 'graphql-tag'

export default gql`{
  allArticles(first: 2, orderBy: _firstPublishedAt_DESC) {
    identifier
    name
    image
    _updatedAt
    jsonLd(markdown: false)
  }
}`