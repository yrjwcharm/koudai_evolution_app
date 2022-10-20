/*
 * @Description:
 * @Autor: wxp
 * @Date: 2022-10-11 18:31:08
 */
import http from '~/services';

export const getData = (data) => {
    return http.get('/audit_center/preview/20221010', data);
};
export const submit = (data) => {
    return http.post('/audit_center/audit/20221010', data);
};
