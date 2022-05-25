package com.licaimofang.SignEngine;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import org.jetbrains.annotations.NotNull;

import android.util.Log;

import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.licaimofang.readcard.utils.BitmapUtil;
import com.ttd.signstandardsdk.TTDFileSignStatus;
import com.ttd.signstandardsdk.TtdSignEngine;
import com.ttd.signstandardsdk.http.bean.FileInfo;
import com.ttd.signstandardsdk.http.bean.ResultInfo;

import com.ttd.signstandardsdk.ui.listener.CallBackListener;
import com.ttd.signstandardsdk.utils.ToastUtil;

import java.util.List;
public class SignModule extends ReactContextBaseJavaModule {
    private static ReactApplicationContext reactContext;
    public SignModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }
    @NonNull
    @NotNull
    @Override
    public String getName() {
        return "SignManager";
    }

    @ReactMethod
    public void init(String appid, boolean isDebug) {
        TtdSignEngine.init(appid,isDebug,new CallBackListener() {
            /**
             * 基金合同签署成功的回调
             * @param signStatus 区分此次签署的类型,使用的是待签署的订单状态值,等效于0,1,2,3或枚举,按需求使用,可不使用
             * @param orderStatus 签署成功后的当前订单状态,可用于更新订单状态
             */
            @Override
            public void signSuccess(int signStatus, int orderStatus, List<ResultInfo> resultInfoList) {
                switch (signStatus) {
                    case TTDFileSignStatus.TTDFileSignStatusRisk:
                        Log.d("ttd", "投资者风险揭示书签署成功后当前的订单状态:" + orderStatus);
                        break;
                    case TTDFileSignStatus.TTDFileSignStatusContract:
                        Log.d("ttd", "投资者合同签署成功后当前的订单状态:" + orderStatus);
                        break;
                    case TTDFileSignStatus.TTDFileSignStatusSupplement:
                        Log.d("ttd", "投资者补充协议签署成功后当前的订单状态:" + orderStatus);
                        break;
                    case TTDFileSignStatus.TTDFileSignStatusRiskOfManager:
                        Log.d("ttd", "理财师风险揭示书签署成功后当前的订单状态:" + orderStatus);
                        break;
                }
                for(ResultInfo resultInfo: resultInfoList){
                    Log.d("ttd", "签署成功的文件:" + resultInfo.getUrl()); //只有补充协议可能有多个的情况
                }
                ToastUtil.showShort(getCurrentActivity(), "签署成功");

            }

            /**
             * 文件签署成功的回调
             * @param fileInfo :签署成功后返回的数据
             */
            @Override
            public void signFileSuccess(FileInfo fileInfo) {
                Log.d("ttd", "文件签署成功:  fileId:" + fileInfo.getFileId());
                Log.d("ttd", "investorState:" + fileInfo.getInvestorState());//投资者签署状态。1，已签署 0,待签署
                Log.d("ttd", "manageState:" + fileInfo.getManageState());//管理人签署状态。1，已签署 0,待签署
                Log.d("ttd", "plannerState:" + fileInfo.getPlannerState());//理财经理签署状态。1，已签署 0,待签署
                WritableMap params = Arguments.createMap();
                params.putString("fileId", fileInfo.getFileId());
                sentMessageToJs(reactContext, "signFileSuccess", params);
//                ToastUtil.showShort(getCurrentActivity(), "签署成功");
            }

            @Override
            public void onSignBatchSuccess(String s, @Nullable String s1, @Nullable String... strings) {

            }

            /**
             * 传入的订单状态和妥妥递后端的订单状态不匹配,需要同步订单状态
             * @param orderStatus 妥妥递后端当前的订单状态
             */
            @Override
            public void orderStatusNoMatch(int orderStatus,List<ResultInfo> resultInfoList) {
                Log.d("ttd", "订单状态不匹配 妥妥递后端当前的订单状态:" + orderStatus);
                if(resultInfoList!=null && resultInfoList.size()>0){
                    for(ResultInfo resultInfo: resultInfoList){
                        Log.d("ttd", "当前状态成功签署的文件:" + resultInfo.getUrl()); //只有补充协议可能有多个的情况
                    }
                }

            }

            @Override
            public void onError(int errorCode, String errorMsg) {
                Log.d("ttd", "签署发生错误退出  错误码:" + errorCode + "  错误信息:" + errorMsg);
                ToastUtil.showShort(getCurrentActivity(), errorMsg);
            }

            /**
             * 按键返回 回调
             */
            @Override
            public void onBack() {
                Log.d("ttd", "退出");
//                ToastUtil.showShort(getCurrentActivity(), "退出");
            }

            /**
             * 预览文件底部按钮 回调
             */
            @Override
            public void previewEnd() {
                Log.d("ttd", "previewEnd");
            }
        });

    }
    //  订单签署
    @ReactMethod
    public void signOrder(String orderNo,int orderStatus){
        TtdSignEngine.signOrder(getCurrentActivity(),orderNo,orderStatus);
    }
    //文件签署
    @ReactMethod
    public void signFile(String filedId,String userNo){
        //投资者文件签署
        TtdSignEngine.signFileForInvestor(getCurrentActivity(), filedId,userNo);
    }
    //文件预览
    @ReactMethod
    public void previewFile(String bucketName,String ObjectKey,String title,String btnText){
        TtdSignEngine.previewFile(getCurrentActivity(), bucketName,ObjectKey,title,btnText);
    }

    /**
     * 发送消息事件到js页面
     *
     * @param reactContext ReactContext 对象
     * @param eventName    事件名称
     * @param params       事件携带的参数
     */
    private void sentMessageToJs(ReactContext reactContext,
                                 String eventName,
                                 @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }
}
