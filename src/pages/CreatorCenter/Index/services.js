/*
 * @Description:
 * @Autor: wxp
 * @Date: 2022-10-09 10:51:33
 */
import http from '~/services';

export const getData = (data) => {
    return http.get('/xxx', data);
};

export const getUnRead = (data) => {
    return http.get('/message/unread/20210101', data);
};
