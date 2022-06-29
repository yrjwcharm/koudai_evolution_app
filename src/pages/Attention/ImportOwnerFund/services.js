/*
 * @Date: 2022-06-28 16:26:07
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-06-29 17:59:55
 * @Description:
 */
import http from '~/services';

export const postImport = (data) => {
    return http.post('http://kapi-web.jinhongyu.mofanglicai.com.cn:10080/follow/import/202206', data);
};
