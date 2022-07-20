import http from '~/services';

export const getSetModel = (params) => {
    return http.get('project/setting/salemodel/202207', params);
};
