/*
 * @Date: 2022-07-13 10:28:43
 * @Description:
 */
import http from '~/services';

export const getInfo = () => {
    return http.get('http://kmapi.huangjianquan.mofanglicai.com.cn:10080/asset/overview/common/20220915');
};
export const getHolding = () => {
    return http.get('http://kmapi.huangjianquan.mofanglicai.com.cn:10080/asset/overview/holding/20220915');
};
export const postAssetClass = (params) => {
    return http.post('http://kmapi.huangjianquan.mofanglicai.com.cn:10080/asset/class/report/20220915', params);
};
