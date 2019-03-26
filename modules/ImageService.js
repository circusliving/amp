import axios from 'axios'
import path from 'path'

const MAXS = [2500,2000,1200,992,768,500,480,411,375,360,320]
const BASE_URL = 'https://images.circusliving.com'
const DIMENSIONS = {}
const DEFAULTS = [
  'https://images.circusliving.com/465x360/circuslivinglogo.min9.png'
]
export default class ImageService {

  static  getDimensions (imageSrc) {

    if (imageSrc && DIMENSIONS[imageSrc]) return DIMENSIONS[imageSrc]

  }
 
  static setDimensions (imageSrc = DEFAULTS) {
    if (!imageSrc) return true

    if (Array.isArray(imageSrc)) {
      let imgs = []
      for (let i = 0; i < imageSrc.length; i++) 
        imgs[i] =  gueryDims(imageSrc)

      return Promise.all(imgs)     
    } 

    return gueryDims(imageSrc)
  }

  static  getSrcSet (imageSrc, percentage = 1) {
    let { name, ext } = path.parse(imageSrc)
    let srcSet = ''
    for (let i = 0; i < MAXS.length; i++) {
      let max     = MAXS[i]
      let width   = getWidth (max,percentage)
      let img     = {name, ext, width}

      srcSet += getSrcSetLine (max,img)
    }
    let length = srcSet.length
    return srcSet.substring(0,length - 2)
  }

}

function getWidth (max,percentage) {
  return Math.floor((max * percentage))
}

function getSrcSetLine (max,{name, ext, width}) {
  return `${BASE_URL}/${width}x${width}/${name}${ext} ${max}w, `
}

function gueryDims (imageSrc) {
  return axios.head(imageSrc).then(({headers}) => {
    let dims =  {
      width: Number(headers['x-amz-meta-width']),
      height: Number(headers['x-amz-meta-height'])
    }
    DIMENSIONS[imageSrc] = dims
  })
}
ImageService.setDimensions()
