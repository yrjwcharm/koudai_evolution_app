/*
 * @Date: 2022-07-13 10:28:43
 * @Description:
 */
import http from '~/services';

export const getInfo = () => {
    return http.get('/asset/v7/common/20220708');
};
export const getHolding = () => {
    return http.get('/asset/v7/holding/20220708');
};
export const getNotice = () => {
    return http.get('/asset/notice/20210101');
};
export const getReadMes = () => {
    return http.get('/message/unread/20210101');
};
