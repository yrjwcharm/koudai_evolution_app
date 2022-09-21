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
export const getNotice = () => {
    return http.get('/asset/notice/20210101');
};
export const getReadMes = () => {
    return http.get('/message/unread/20210101');
};
export const closeRecommend = (params) => {
    return http.post('/asset/v7/close_recommend/20220708', params);
};
export const postAssetClass = (params) => {
    return http.post('http://kmapi.huangjianquan.mofanglicai.com.cn:10080/asset/class/report/20220915', params);
};
