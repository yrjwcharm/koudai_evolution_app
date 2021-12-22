package com.licaimofang.readcard;

import android.graphics.Bitmap;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;


import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.lpy.readcard.compound.entity.IdentityCard;
import com.lpy.readcard.listener.OnReaderListener;
import com.lpy.readcard.listener.OnResultListerner;
import com.lpy.readcard.listener.OnResultPageEventListener;
import com.lpy.readcard.open.LPYReadCardFactory;
import com.lpy.readcard.read.bean.HardwareInfo;
import com.licaimofang.readcard.bean.IdDetailBean;
import com.licaimofang.readcard.utils.BitmapUtil;
import com.licaimofang.readcard.utils.GsonUtils;
import com.licaimofang.readcard.utils.MLog;

import org.jetbrains.annotations.NotNull;


public class ReadCardModule extends ReactContextBaseJavaModule {
    private static ReactApplicationContext reactContext;


    public ReadCardModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    @NonNull
    @NotNull
    @Override
    public String getName() {
        return "ReadCardManager";
    }

    @ReactMethod
    public void init(String appid, String ip, int port, int envCode, int count, Callback successCallBack, Callback errorCallBack) {
        LPYReadCardFactory.initSdk(reactContext,
                appid,
                ip,
                port,
                envCode,
                count, new OnResultListerner() {
                    @Override
                    public void onSuccess() {
                        successCallBack.invoke();
                        MLog.d("MApplication", "onSuccess-----");

                    }

                    @Override
                    public void onFailed(int i) {
                        errorCallBack.invoke(i);
                        MLog.d("MApplication", "onFailed-----" + i);
                    }
                });
    }

    @ReactMethod
    public void showReadCardActivity() {
        OnReaderListener onReaderListener = new OnReaderListener() {
            @Override
            public void onReadSuccess(String reqId, HardwareInfo hardwareInfo) {
                LPYReadCardFactory.getPageRouterSE().removeAllReadPageListener();
                //读卡成功获取到reqId，回调给JS页面和后端进行交互获取9要素信息
                WritableMap params = Arguments.createMap();
                params.putString("reqId", reqId);
                params.putString("hardWareId", hardwareInfo.getHardWareId());
                sentMessageToJs(reactContext, "readCardSuccess", params);
            }

            @Override
            public void onReadFailed(int i, String s) {
                LPYReadCardFactory.getPageRouterSE().removeAllReadPageListener();
                WritableMap params = Arguments.createMap();
                params.putInt("errorCode", i);
                params.putString("errorMessage", s);
                sentMessageToJs(reactContext, "readCardFailed", params);
            }
        };
        //进入读卡页面
        LPYReadCardFactory.getPageRouterSE().toReadCardPage(ActivityNavigator.navigator().getLastActivity());
        //添加读卡页面事件监听
        LPYReadCardFactory.getPageRouterSE().addReadPageListener(onReaderListener);

        LPYReadCardFactory.getPageRouterSE().addReadResultPageListener(new OnResultPageEventListener() {
            @Override
            public void onPageClose(int i, Bitmap bitmap, Bitmap bitmap1, Bitmap bitmap2) {
                LPYReadCardFactory.getPageRouterSE().removeAllResultPageListener();
                //进入结果页面成功，返回图像位图的base64字符串个js页面
                WritableMap params = Arguments.createMap();
                params.putInt("code", i);
                params.putString("frontBitmapBase64Str", BitmapUtil.bitmapToBase64(bitmap));
                params.putString("backBitmapBase64Str", BitmapUtil.bitmapToBase64(bitmap1));
                params.putString("fullBitmapBase64Str", BitmapUtil.bitmapToBase64(bitmap2));
                sentMessageToJs(reactContext, "confirmConfirmInfo", params);

            }

            @Override
            public void onPageLoadError() {
                LPYReadCardFactory.getPageRouterSE().removeAllResultPageListener();
                WritableMap params = Arguments.createMap();
                sentMessageToJs(reactContext, "confirmInfoFailed", params);

            }
        });

    }

    @ReactMethod
    public void showResultActivity(String identityCardData) {
        MLog.d(Contants.LOG_EVENT, "identityCardData~" + identityCardData);
        IdDetailBean idDetailBean = (IdDetailBean) GsonUtils.jsonToObj(identityCardData,IdDetailBean.class);
        IdentityCard identityCard = new IdentityCard(idDetailBean.getName(), idDetailBean.getSex(), idDetailBean.getNation(), idDetailBean.getBirthDate(), idDetailBean.getAddress(), idDetailBean.getIdnum(),
                idDetailBean.getSigningOrganization(), idDetailBean.getBeginTime()+idDetailBean.getEndTime(), idDetailBean.getPicture());
        LPYReadCardFactory.getPageRouterSE().toResultPage(ActivityNavigator.navigator().getLastActivity(), identityCard);
    }


    @ReactMethod
    public void getNfcState(Callback callback) {
        callback.invoke(LPYReadCardFactory.getLPYReadCardSE().isNFCAvailable(ActivityNavigator.navigator().getLastActivity()));
    }


    @ReactMethod
    public void showLoadingView(){
        ActivityNavigator.navigator().getLastActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                LPYReadCardFactory.getPageRouterSE().showLoading();
            }
        });

    }

    @ReactMethod
    public void hideLoadingView(){
        ActivityNavigator.navigator().getLastActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                LPYReadCardFactory.getPageRouterSE().hideLoading();
            }
        });

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
