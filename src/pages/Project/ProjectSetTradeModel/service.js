import http from '~/services';

export const getSetModel = (params) => {
    return http.get('project/setting/salemodel/202207', params);
};
export const getNextDay = (params) => {
    return http.get('/trade/fix_invest/next_day/20210101', params);
};
