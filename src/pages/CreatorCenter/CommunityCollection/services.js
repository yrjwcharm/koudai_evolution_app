/*
 * @Description:
 * @Autor: wxp
 * @Date: 2022-10-11 18:31:08
 */
import http from '~/services';

export const getData = (data) => {
    return http.get('/community/types/20220928', data);
};

export const getList = (data) => {
    return http.get('/community/list/20220928', data);
};
