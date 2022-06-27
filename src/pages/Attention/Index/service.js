/*
 * @Date: 2022-06-21 14:29:37
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-06-27 15:41:13
 * @Description:
 */
import http from '~/services';

export const getData = () => {
    return http.get('http://kapi-web.jinhongyu.mofanglicai.com.cn:10080/follow/index/202206');
};
export const getFollowList = (params) => {
    return http.get('http://kapi-web.jinhongyu.mofanglicai.com.cn:10080/follow/list/202206', params);
};
export const followAdd = (data) => {
    return http.get('http://kapi-web.jinhongyu.mofanglicai.com.cn:10080/follow/add/202206', data);
};
