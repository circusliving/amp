import gql from 'graphql-tag'

export default gql`{
  allWebPages (
    first:100,
    orderBy: [path_ASC]
  ){
    name,
    menuName,
    path,
    url,
    order
  }
}`