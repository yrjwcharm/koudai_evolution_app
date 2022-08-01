/*
 * @Date: 2022-07-21 11:46:11
 * @Description:
 */
import http from '~/services';

export const getSetModel = (params) => {
    return http.get('project/setting/salemodel/202207', params);
};
export const getNextDay = (params) => {
    return http.get('/trade/fix_invest/next_day/20210101', params);
};
export const getPossible = (params) => {
    return http.get('/trade/fix_invest/target_info/20210101', params);
};
export const getNextPath = (parmas) => {
    return http.post('/project/setting/get_next_step', parmas);
};
export const postLeaveTrace = (params) => {
    return http.post('/project/setting/leave_trace/202207', params);
};
