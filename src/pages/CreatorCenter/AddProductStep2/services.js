/*
 * @Description:
 * @Autor: wxp
 * @Date: 2022-10-12 14:19:16
 */
import http from '~/services';

export const getData = (data) => {
    return http.get('/subject/manage/products/20220901', data);
};
export const getListData = (data) => {
    return http.post('/subject/manage/products/show/20220901', data);
};
export const goSave = (data) => {
    return http.post('/subject/manage/products/modify/20220901', data);
};
