/*
 * @Description:
 * @Autor: wxp
 * @Date: 2022-10-09 10:51:33
 */
import http from '~/services';

export const getData = (data) => {
    return http.get('/subject/manage/card_style/menus/20220901', data);
};
export const goSave = (data) => {
    return http.post('/subject/manage/card_style/data_modify/20220901', data);
};
