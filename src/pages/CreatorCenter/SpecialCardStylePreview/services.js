/*
 * @Description:
 * @Autor: wxp
 * @Date: 2022-10-11 18:31:08
 */
import http from '~/services';

export const getData = (data) => {
    return http.get('/subject/manage/card_style/preview/20220901', data);
};
