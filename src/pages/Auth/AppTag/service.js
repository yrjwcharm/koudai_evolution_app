/*
 * @Date: 2022-07-02 15:19:38
 * @Description:
 */
import http from '~/services';

export const getTagData = () => {
    return http.get('/preference/tags/pop/20220608');
};
export const handleQuestion = (parmas) => {
    return http.post('/preference/tags/submit/20220608', parmas);
};
export const handleDone = () => {
    return http.post('/preference/tags/done/20220608');
};
