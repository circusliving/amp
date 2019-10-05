import gql from 'graphql-tag'

export default gql`query article($identifier: String!) {
  article(filter: { identifier: { eq: $identifier } }) {
    name
    alternateName
    text,
    image,
    coverImage
  }
}`