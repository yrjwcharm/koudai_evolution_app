/*
 * @Date: 2022-08-11 16:45:12
 * @Description: 基金购买页接口
 */
import http from "~/services";

export const getBuyInfo = (params) => http.get("/fund/buy/info/20220701", params);

export const getBatchBuyInfo = (params) => http.get("/fund/batch/buy/info/20221222", params);

export const getBuyFee = (params) => http.get("/fund/buy/fee/20220701", params);

export const getBatchBuyFee = (params) => http.get("/fund/batch/buy/fee/20230112", params);

export const getNextDay = (params) => http.get("/trade/fix_invest/next_day/20210101", params);

export const fundBuyDo = (params) => http.post("/fund/buy/do/20220701", params);

export const fundBatchBuyDo = (params) => http.post("/fund/batch/buy/do/20221222", params);

export const fundFixDo = (params) => http.post("/trade/fix_invest/do/20210101", params);

export const getBuyQuestionnaire = (params) => http.get("/questionnaire/compliance/202208", params);

export const postQuestionAnswer = (params) => http.post('/questionnaire/appear/202208', params);
