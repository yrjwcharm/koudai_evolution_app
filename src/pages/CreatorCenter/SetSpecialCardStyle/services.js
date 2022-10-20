/*
 * @Description:
 * @Autor: wxp
 * @Date: 2022-10-11 18:31:08
 */
import http from '~/services';

export const getData = (data) => {
    return http.get('/subject/manage/card_style/options/20220901', data);
};

export const goSave = (data) => {
    return http.post('/subject/manage/card_style/modify/20220901', data);
};
