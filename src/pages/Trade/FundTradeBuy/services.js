/*
 * @Date: 2022-08-11 16:45:12
 * @Description: 基金购买页接口
 */
import http from '~/services';

export const getBuyInfo = (params) => http.get('/fund/buy/info/20220701', params);

export const getBuyFee = (params) => http.get('/fund/buy/fee/20220701', params);

export const fundBuyDo = (params) => http.post('/fund/buy/do/20220701', params);

export const getBuyQuestionnaire = (params) => http.get('/questionnaire/compliance/202208', params);

export const postQuestionAnswer = (params) => http.post('/questionnaire/appear/202208', params);
