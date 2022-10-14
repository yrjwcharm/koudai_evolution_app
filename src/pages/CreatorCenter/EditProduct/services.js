import http from '~/services';

export const getData = (data) => {
    return http.get('/subject/manage/product/options/20220901', data);
};
