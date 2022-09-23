/*
 * @Date: 2022-09-21 16:07:04
 * @Description:
 */
import http from '~/services';

export const getList = (params) => {
    return http.get('/platform_tool/settings/list/20220915', params);
};
export const toolSave = (params) => {
    return http.post('/platform_tool/settings/save/20220915', params);
};
