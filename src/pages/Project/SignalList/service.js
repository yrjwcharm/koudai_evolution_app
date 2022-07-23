/*
 * @Date: 2022-07-23 12:08:22
 * @Description:
 */
import http from '~/services';

export const getList = () => {
    return http.get('tool/signal/list/20220713');
};
