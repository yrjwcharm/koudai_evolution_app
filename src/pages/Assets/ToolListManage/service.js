/*
 * @Date: 2022-09-21 16:07:04
 * @Description:
 */
import http from '~/services';

export const getList = (params) => {
    return http.get('http://kapiweb.mayue.mofanglicai.com.cn:10080/platform_tool/settings/list/20220915', params);
};
