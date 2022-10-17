/*
 * @Description:
 * @Autor: wxp
 * @Date: 2022-10-09 10:51:33
 */
import http from '~/services';

export const getData = (data) => {
    return http.get('/xxx', data);
};
