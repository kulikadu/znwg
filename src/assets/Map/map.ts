import { View } from 'ol'
import { fromLonLat } from 'ol/proj'

const beijing = fromLonLat([116.28, 39.54])
const hunan = fromLonLat([112.07180996128585, 27.270889346140297])

export const getView = () => {
  return new View({
    center: hunan,
    minZoom: 2,
    zoom: 7.3,
    maxZoom: 18
  })
}
