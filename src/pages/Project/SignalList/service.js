/*
 * @Date: 2022-07-23 12:08:22
 * @Description:
 */
import http from '~/services';

export const getList = () => {
    return http.get('index/manager/detail/20220713');
};
