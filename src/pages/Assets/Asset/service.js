/*
 * @Date: 2022-07-13 10:28:43
 * @Description:
 */
import http from '~/services';

export const getInfo = () => {
    return http.get('http://kapi-web.lixiaoguang.mofanglicai.com.cn:10080/asset/v7/common/20220708');
};
export const getHolding = () => {
    return http.get('http://kapi-web.lixiaoguang.mofanglicai.com.cn:10080/asset/v7/holding/20220708');
};
