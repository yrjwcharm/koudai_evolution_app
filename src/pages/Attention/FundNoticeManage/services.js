/*
 * @Date: 2022-06-29 15:07:07
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-06-29 15:08:51
 * @Description:
 */
import http from '~/services';

export const getSettingData = () => {
    return http.get('/notice/get/setting/202206');
};
