import http from '../../services';
export const getPKHomeData = () => {
    return http.get('/pk/index/20220608');
};

export const getFundRankData = (data) => {
    return http.get('/fund/rank/list/20220608', data);
};

export const getPKDetailData = (data) => {
    return http.get('/pk/detail/20220608', data);
};

export const getPKChartDetail = (data) => {
    return http.get('/pk/chart/detail/20220608', data);
};

export const postPKWeightSwitch = (data) => {
    return http.post('/pk/weight/switch/20220608', data);
};

export const followListLite = (data) => {
    return http.get('/follow/listlite/202206', {item_type: 1});
};

export const pkChooseDefaultData = (data) => {
    return http.get('/pk/choose/default/20220608', data);
};

export const hotpkData = (data) => {
    return http.get('/pk/hotpk/20220608', data);
};

export const borwseListData = (data) => {
    return http.get('/pk/browse/list/20220608', data);
};
