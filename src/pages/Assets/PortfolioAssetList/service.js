import http from '~/services';

/*
 * @Date: 2022-09-23 11:13:21
 * @Description:
 */
export const getData = (parmas) => {
    return http.get('/asset/class/common/20220915', parmas);
};
