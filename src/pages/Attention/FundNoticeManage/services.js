/*
 * @Date: 2022-06-29 15:07:07
 * @Author: yhc
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-06-29 22:51:22
 * @Description:
 */
import http from '~/services';

export const getSettingData = () => {
    return http.get('/notice/get/setting/202206');
};
export const setEvent = (params) => {
    return http.post('/notice/set/event/202206', params);
};
