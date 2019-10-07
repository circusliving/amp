import axios from 'axios'
import path from 'path'

const MAXS = [ 2500, 2000, 1200, 992, 768, 500, 480, 411, 375, 360, 320 ]
const BASE_URL = 'https://images.circusliving.com'
const DIMENSIONS = {}
const DEFAULTS = [
  'https://images.circusliving.com/465x360/circuslivinglogo.min9.webp'
]

export default class ImageService{
  static  getDimensions (imageSrc = DEFAULTS[0]){
    if (imageSrc && DIMENSIONS[imageSrc]) return DIMENSIONS[imageSrc]
    else return DIMENSIONS[DEFAULTS[0]]
  }
 
  static setDimensions (imageSrc = DEFAULTS){
    if (!imageSrc) return true

    if (Array.isArray(imageSrc)){
      const imgs = []

      for (let i = 0; i < imageSrc.length; i++)
        imgs[i] =  gueryDims(imageSrc)

      return Promise.all(imgs)
    }

    return gueryDims(imageSrc)
  }

  static  getSrcSet ({ src, width }, percentage = 1){
    const { name, ext } = path.parse(src)
    let srcSet = ''
    const maxs = MAXS.filter((n) => n<=Number(width))

    for (let i = 0; i < maxs.length; i++){
      const max     = maxs[i]
      const dim   = getWidth(max, percentage)
      const img     = { name, ext, width, dim }

      srcSet += getSrcSetLine(max, img)
    }
    const length = srcSet.length

    return srcSet.substring(0, length - 2)
  }

  static width(src){
    return ImageService.getDimensions(src).width
  }
  
  static height(src){
    return ImageService.getDimensions(src).height
  }

  static alt(src){
    return ImageService.getDimensions(src).alt
  }
}

async function getImageAttrs (attrs){
  try {
    const ampAttrs = []
    let headers = []

    try{
      for (let i = 0; i < attrs.length; i++)
        headers[i] = axios.head(attrs[i].src).then((r) => r.data)
    
      headers = await Promise.all(headers)
    }
catch(e){
      console.warn(e.message)
    }
    for (let i = 0; i < headers.length; i++){
      headers[i] = headers[i].headers
      ampAttrs[i] = Object.assign(attrs[i], { width: Number(headers[i]['x-amz-meta-width']), height: Number(headers[i]['x-amz-meta-height']) })
      const dims =  {
        width : Number(headers[i]['x-amz-meta-width']),
        height: Number(headers[i]['x-amz-meta-height']),
        ...attrs[i]
      }

      // console.log(DIMENSIONS[attrs[i].src])
      DIMENSIONS[attrs[i].src] = dims
      DIMENSIONS[attrs[i].src].srcSet= ImageService.getSrcSet(attrs[i])
    }

    return ampAttrs
  }
catch(e){
    console.error(e.toString())
  }
}

function getWidth (max, percentage){
  return Math.floor((max * percentage))
}

function getSrcSetLine (max, { name, ext, dim }){
  return `${BASE_URL}/${dim}x${dim}/${name}${ext} ${max}w, `
}

function gueryDims (imageSrc){
  return axios.head(imageSrc).then(({ headers }) => {
    const dims =  {
      width : Number(headers['x-amz-meta-width']),
      height: Number(headers['x-amz-meta-height']),
      alt   : headers['x-amz-meta-alt'] || headers['x-amz-meta-tags'] || ' Circus living image',
      src   : imageSrc
    }

    DIMENSIONS[imageSrc] = dims
    DIMENSIONS[imageSrc].srcSet= ImageService.getSrcSet(dims)
  }).catch((e) => { console.warn(e) })
}