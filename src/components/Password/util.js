/*
 * @Date: 2021-01-05 16:16:29
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-01-05 19:38:44
 * @Description:密码弹窗常量
 */
import {px} from '../../utils/appUtil';
export const constants = {
    prefixName: 'password',
    titleHeight: px(48),
    inputItemHeight: px(44),
    inputItemWidth: px(48),
    borderWidth: 0.5,
    borderColor: '#C7C7C7',
};
export const warn = (msg) => {
    if (__DEV__) {
        console.warn(`[${constants.prefixName}]:${msg}`);
    }
};
