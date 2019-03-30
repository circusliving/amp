const ampVersion = 'v0'
const ampComponentVersion = '0.1'
const ampComponents = ['amp-carousel', 'amp-sidebar', 'amp-accordion', 'amp-instagram', 'amp-social-share', 'amp-fx-collection']

const cleanStyleTags = (html) => {
  html = html.replace(/<style data-vue-ssr/g, '<style amp-custom data-vue-ssr')
  let styles = html.match(/<style amp-custom\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi)
  html = html.replace(/<style amp-custom\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')

  let oneStyle = ''
  if (styles) {
    for (let i = 0; i < styles.length; i++) {
      styles[i] = styles[i].replace(/<style amp-custom .*>/gi, '')
      styles[i] = styles[i].replace(/<\/style>/gi, '')
      oneStyle += styles[i] + '\n'
    }
  }
  return html.replace('</head>', `\n<style amp-custom data-vue-ssr>${oneStyle}</style>\n` + '\n</head>')
}

export const modifyHtml = (html) => {
  // Remove every script tag from generated HTML
  html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')

  // Add AMP script before </head>
  html = html.replace('</head>', scriptAmpComponents(ampComponents) + '\n</head>')

  // Add AMP boilerplate
  const ampBoilerplate = `<style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>`
  html = html.replace('</head>', ampBoilerplate + '\n</head>')

  // consolidate styles in custom amp styles
  html = cleanStyleTags(html)

  // Make it ⚡
  html = html.replace('<html', '<html ⚡')

  return html
}


function scriptAmpComponents (ampComponents){
  let scriptString = `<script async src="https://cdn.ampproject.org/${ampVersion}.js"></script> `

  ampComponents.forEach( name => {
    scriptString += `<script custom-element="${name}" src="https://cdn.ampproject.org/${ampVersion}/${name}-${ampComponentVersion}.js" async=""></script> `
  })

  return scriptString
}
