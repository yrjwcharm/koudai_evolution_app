import http from '~/services';

/*
 * @Date: 2022-07-23 13:38:17
 * @Description:
 */
export const getData = (params) => {
    return http.get('/project/confirm/setting/202207', params);
};
