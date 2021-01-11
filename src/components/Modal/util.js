/*
 * @Date: 2021-01-05 16:16:29
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-01-08 12:18:38
 * @Description:密码弹窗常量
 */
import {px} from '../../utils/appUtil';
export const constants = {
    prefixName: 'Modal',
    titleHeight: px(48),
    bottomMinHeight:px(300),
    borderWidth: 0.5,
    borderColor: '#C7C7C7',
    borderRadius:8
};
export const warn = (msg) => {
    if (__DEV__) {
        console.warn(`[${constants.prefixName}]:${msg}`);
    }
};
