/*
 * @Date: 2023-01-09 16:51:02
 * @Description:
 */
import http from '~/services';

export const getSignalInfo = (params) => {
    return http.get('signal/manage/info/20230106', params);
};
export const getStopSignal = (params) => {
    return http.get('signal/manage/stop/list/20230106', params);
};
