/*
 * @Description:
 * @Autor: wxp
 * @Date: 2022-10-11 18:31:08
 */
import http from '~/services';

export const getData = (data) => {
    return http.get('/manage_center/ss_collect/index/20221010', data);
};

export const getList = (data) => {
    return http.get('/manage_center/ss_collect/list/20221010', data);
};
