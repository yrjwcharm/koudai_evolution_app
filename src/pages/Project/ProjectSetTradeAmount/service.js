/*
 * @Date: 2022-07-20 17:12:00
 * @Description:
 */
import http from '~/services';

export const getInfo = (params) => {
    return http.get('/project/setting/invest/202207', params);
};
export const postDo = (params) => {
    return http.post('/project/fix_invest/do/202207', params);
};
