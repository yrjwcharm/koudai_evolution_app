import * as React from 'react';
import { TextInput, Text } from 'react-native';
//解决小米手机字体显示不全
const defaultFontFamily = {
  ...Platform.select({
    android: { fontFamily: ' ' }
  })
}
const oldRender = Text.render;
Text.render = function (...args) {
  const origin = oldRender.call(this, ...args);
  return React.cloneElement(origin, {
    style: [defaultFontFamily, origin.props.style]
  });
};
//控制字体不受手机字体影响
Text.defaultProps = Object.assign({}, Text.defaultProps, { allowFontScaling: false });
TextInput.defaultProps = Object.assign({}, TextInput.defaultProps, { allowFontScaling: false })