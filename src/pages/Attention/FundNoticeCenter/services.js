/*
 * @Date: 2022-06-30 10:41:46
 * @Description:
 */
import http from '~/services';

export const getMessageList = (params) => {
    return http.get('/notice/get/messagelist/202206', params);
};
