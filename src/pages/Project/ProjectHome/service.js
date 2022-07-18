/*
 * @Date: 2022-07-18 11:30:20
 * @Description:
 */
import http from '~/services';

export const getProjectData = () => {
    return http.get('/tool/signal/index_list/20220713');
};
