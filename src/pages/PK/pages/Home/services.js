import http from '../../../../services';
export const getPKHomeData = () => {
    return http.get('/home/detail/20210101');
};
