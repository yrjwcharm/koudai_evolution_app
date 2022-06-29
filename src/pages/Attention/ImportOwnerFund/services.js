/*
 * @Date: 2022-06-28 16:26:07
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-06-28 16:28:58
 * @Description:
 */
import http from '~/services';

export const postImport = (data) => {
    return http.post('http://kapi-web.jinhongyu.mofanglicai.com.cn:10080/follow/add/202206', data);
};
