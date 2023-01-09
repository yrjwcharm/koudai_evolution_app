/*
 * @Date: 2023-01-09 16:51:02
 * @Description:
 */
import http from '~/services';

export const getSignalInfo = (params) => {
    http.get('signal/manager/info/20220106', params);
};
