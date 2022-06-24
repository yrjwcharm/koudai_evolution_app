/*
 * @Date: 2022-06-21 14:29:37
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-06-23 11:31:42
 * @Description:
 */
import http from '~/services';

export const getData = () => {
    return http.get('http://kapi-web.jinhongyu.mofanglicai.com.cn:10080/follow/index/202206');
};
export const getFollowList = (params) => {
    return http.get('http://kapi-web.jinhongyu.mofanglicai.com.cn:10080/follow/list/202206', params);
};
