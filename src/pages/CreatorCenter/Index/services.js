/*
 * @Description:
 * @Autor: wxp
 * @Date: 2022-10-09 10:51:33
 */
import http from '~/services';

export const getData = (data) => {
    return http.get('/manage_center/index/20221010', data);
};

export const getList = (data) => {
    return http.get('/manage_center/collect_list/20221010', data);
};

export const getUnRead = (data) => {
    return http.get('/message/unread/20210101', data);
};
