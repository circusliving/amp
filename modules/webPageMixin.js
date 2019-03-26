
export default {
  scrollToTop: true,
  head () {
    return {
      title: this.alternateName || this.name,
      link: [
        // We use $route.path since we don't use query parameters
        {
          hid: 'canonical',
          rel: 'canonical',
          href: this.url || `${process.env.BASE_URL}${process.env.BASE_PATH}${this.$route.path}`
        }
      ],
      meta: [
        { hid: 'description', name: 'description', content: this.description},
        { hid: 'twitter:title', name: 'twitter:title', content: this.alternateName || this.name},
        { hid: 'twitter:description', name: 'twitter:description', content: this.description},
        { hid: 'og:title', name: 'og:title', content: this.alternateName || this.name},
        { hid: 'og:description', name: 'og:description', content: this.description},
        { hid: 'lang', name: 'lang', content: 'en' },
        { hid: 'og:image', name: 'og:image', content: this.image },
        { hid: 'twitter:card', name: 'twitter:card', content: 'summary' },
        { hid: 'twitter:site', name: 'twitter:site', content: '@cathoulahan' },
        { hid: 'twitter:image', name: 'twitter:image', content: this.image },
        { hid: 'twitter:image:alt', name: 'twitter:image:alt', content: this.alternateName || this.name}

      ]
    }
  }

}
