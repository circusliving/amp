query place($identifierId: String!) {
  place(filter: { identifier: { anyIn: [$identifierId] } }) {
    name
    alternateName
    text,
    image,
    coverImage
  }
}