/*
 * @Date: 2021-01-05 16:16:29
 * @Author: yhc
 * @LastEditors: dx
 * @LastEditTime: 2021-03-29 11:42:16
 * @Description:密码弹窗常量
 */
import {px} from '../../utils/appUtil';
export const constants = {
    prefixName: 'Modal',
    titleHeight: px(48),
    bottomMinHeight: px(300),
    borderWidth: 0.5,
    borderColor: '#e2e4ea',
    borderRadius: 8,
};
export const warn = (msg) => {
    if (__DEV__) {
        console.warn(`[${constants.prefixName}]:${msg}`);
    }
};
