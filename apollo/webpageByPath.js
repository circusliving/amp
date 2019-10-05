import gql from 'graphql-tag'

export default gql`query webPage($path: String!) {
  webPage(filter: { path: { eq: $path } }) {
    url,
    name,
    description,
    alternateName,
    text,
    image,
    coverImage,
    widget,
    widgetCollections 
      {
        name
      },
    widgetTags
      {
        id
      },
    redirect
  }
}`