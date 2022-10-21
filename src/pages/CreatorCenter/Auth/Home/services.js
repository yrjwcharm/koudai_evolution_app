/*
 * @Date: 2022-10-17 21:43:12
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2022-10-20 21:52:03
 * @FilePath: /koudai_evolution_app/src/pages/CreatorCenter/Auth/Home/services.js
 * @Description: 审核中心 接口
 */
import http from '~/services';

/** 审核中心主页 */
export const getData = (data) => {
    return http.get('/audit_center/index/20221010', data);
};

/** 审核中心列表 */
export const getList = (data) => {
    return http.get('/audit_center/list/20221010', data);
};

export const getUnRead = (data) => {
    return http.get('/message/unread/20210101', data);
};
