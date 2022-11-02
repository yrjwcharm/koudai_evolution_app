/*
 * @Date: 2022-11-02 14:41:19
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2022-11-02 14:47:09
 * @FilePath: /koudai_evolution_app/src/components/hooks/useSafeBottomHeight.js
 * @Description: 兼容安卓、iOS的底部安全距离
 */

import {Platform} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

/** 返回距离屏幕底部的安全距离 */
export default function useSafeBottomHeight() {
    const insets = useSafeAreaInsets();
    const bottom = Platform.select({
        ios: insets.bottom,
        android: 20, // TODO: 暂时写死，有更好的再换
    });

    return bottom;
}
