import {
  Dimensions,
  PixelRatio,
  Platform,
} from 'react-native';
let pixelRatio = PixelRatio.get();
const defaultPixel = 2;                           //iphone6的像素密度
export const deviceWidth = Dimensions.get('window').width;      //设备的宽度
export const deviceHeight = Dimensions.get('window').height;    //设备的高度
const w2 = 750 / defaultPixel;
const h2 = 1334 / defaultPixel;

const scale = Math.min(deviceHeight / h2, deviceWidth / w2);   //获取缩放比例

export function px (size) {
  if (pixelRatio >= 3 && Platform.OS == 'ios' && size == 1) {
    return size
  }
  return Math.round((size * scale));
}
// iPhoneX
const X_WIDTH = 375;
const X_HEIGHT = 812;
//inPhone11
const ELE_WIDTH = 414;
const ELE_HEIGHT = 896;
export function isIphoneX () {
  return (
    Platform.OS === 'ios' &&
    ((deviceHeight === X_HEIGHT && deviceWidth === X_WIDTH) ||
      (deviceHeight === ELE_HEIGHT && deviceWidth === ELE_WIDTH))
  )
}