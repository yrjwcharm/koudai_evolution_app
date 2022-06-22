/*
 * @Date: 2022-06-21 14:29:37
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-06-21 20:14:53
 * @Description:
 */
import http from '~/services';

export const getData = async () => {
    return await http.get('http://kapi-web.jinhongyu.mofanglicai.com.cn:10080/follow/index/202206');
};
