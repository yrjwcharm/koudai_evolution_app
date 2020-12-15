const env = 'develop' //默认
const SERVER_URL = {
  online: { // 正式环境
    SERVER_URL: 'https://polaris-api.licaimofang.com'
  },
  pre1: {
    SERVER_URL: "https://pre1-polaris-api.licaimofang.com"
  },
  wg: {
    SERVER_URL: "http://polaris-api.wanggang.mofanglicai.com.cn:10080",
  },
  lff: {
    SERVER_URL: "http://polaris.lifangfang.mofanglicai.com.cn:10080"
  },
  develop: {
    SERVER_URL: 'http://polaris-api.bae.mofanglicai.com.cn:10080'
  },
  ll: {
    SERVER_URL: "http://polaris-api.ll.mofanglicai.com.cn:10080"
  },

}
export default SERVER_URL[env]