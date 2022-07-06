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

export const pkIntroduce = (data) => {
    return http.get('/pk/introduce/20220608', data);
};

export const weightDetail = (data) => {
    return http.get('/pk/weight/deail/20220608', data);
};

export const weightReset = (data) => {
    return http.get('/pk/weight/reset/20220608', data);
};

export const weightSetting = (data) => {
    return http.post('/pk/weight/setting/20220608', data);
};

export const getPKBetter = (data) => {
    return http.get('/pk/better/20220608', data);
};
export const getPKWeightBetter = (data) => {
    return http.get('/pk/weight/better/20220608', data);
};
