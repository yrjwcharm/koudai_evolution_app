package com.licaimofang.readcard;

import android.graphics.Bitmap;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;

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
import com.lpy.readcard.read.bean.UIConfig;
import com.licaimofang.readcard.bean.IdDetailBean;
import com.licaimofang.readcard.utils.BitmapUtil;
import com.licaimofang.readcard.utils.GsonUtils;
import com.licaimofang.readcard.utils.MLog;

import org.jetbrains.annotations.NotNull;
import org.json.JSONException;
import org.json.JSONObject;


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
    public void showReadCardActivity(String UIConfigJson) {
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

        //设置UI主题
        UIConfig uiConfig = getUiConfig(UIConfigJson);
        //进入读卡页面
        LPYReadCardFactory.getPageRouterSE().toReadCardPage(ActivityNavigator.navigator().getLastActivity(), uiConfig);
        //添加读卡页面事件监听
        LPYReadCardFactory.getPageRouterSE().addReadPageListener(onReaderListener);

        LPYReadCardFactory.getPageRouterSE().addReadResultPageListener(new OnResultPageEventListener() {
            @Override
            public void onPageClose(int i, Bitmap bitmap, Bitmap bitmap1, Bitmap bitmap2) {
                LPYReadCardFactory.getPageRouterSE().removeAllResultPageListener();
                //进入结果页面成功，返回图像位图的base64字符串个js页面
                WritableMap params = Arguments.createMap();
                params.putInt("code", i-1);
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

    private UIConfig getUiConfig(String UIConfigJson) {
        if (UIConfigJson == null || UIConfigJson.isEmpty()) {
            return null;
        }
        UIConfig uiConfig = LPYReadCardFactory.getPageRouterSE().getUIConfig();
        try {
            JSONObject jsonObject = new JSONObject(UIConfigJson);
            Object readTitle = jsonObject.get("readTitle");
            Object readTitleColor = jsonObject.get("readTitleColor");
            Object readBtnTextColor = jsonObject.get("readBtnTextColor");
            Object readBtnBgColor = jsonObject.get("readBtnBgColor");
            Object bottomTipText = jsonObject.get("bottomTipText");
            Object bottomTipTextColor = jsonObject.get("bottomTipTextColor");
            Object bottomTipImageDrawableBase64 = jsonObject.get("bottomTipImageDrawableBase64");
            Object sureMessageTextColor = jsonObject.get("sureMessageTextColor");
            Object sureMessageBgColor = jsonObject.get("sureMessageBgColor");
            Object openNfcBtnBgColor = jsonObject.get("openNfcBtnBgColor");
            Object openNfcBtnTextColor = jsonObject.get("openNfcBtnTextColor");
            //读卡标题文案
            if (readTitle != null && !readTitle.toString().equals("")) {
                uiConfig.setReadTitle(readTitle.toString());
            }
            // 读卡标题色值
            if (readTitleColor != null && !readTitleColor.toString().equals("")) {
                uiConfig.setReadTitleColor(readTitleColor.toString());
            }
            // 读卡按钮文字颜色
            if (readBtnTextColor != null && !readBtnTextColor.toString().equals("")) {
                uiConfig.setReadBtnTextColor(readBtnTextColor.toString());
            }
            //读卡按钮背景颜色
            if (readBtnBgColor != null && !readBtnBgColor.toString().equals("")) {
                uiConfig.setReadBtnBgColor(readBtnBgColor.toString());
            }

            //底部提示语文案
            if (bottomTipText != null && !bottomTipText.toString().equals("")) {
                uiConfig.setBottomTipTextColor(bottomTipText.toString());
            }
            //底部提示语文案颜色
            if (bottomTipTextColor != null && !bottomTipTextColor.toString().equals("")) {
                uiConfig.setBottomTipTextColor(bottomTipTextColor.toString());
            }
            //底部提示语base64 icon图片
            if (bottomTipImageDrawableBase64 != null && !bottomTipImageDrawableBase64.toString().equals("")) {
                Bitmap bitmap = BitmapUtil.base64ToBitmap(bottomTipImageDrawableBase64.toString());
               if (bitmap!=null){
                   Drawable drawable = new BitmapDrawable(bitmap);
                   uiConfig.setBottomTipImageDrawable(drawable);
               }

            }

            //确认信息文字颜色
            if (sureMessageTextColor != null && !sureMessageTextColor.toString().equals("")) {
                uiConfig.setSureMessageTextColor(sureMessageTextColor.toString());
            }
            //确认信息背景颜色
            if (sureMessageBgColor != null && !sureMessageBgColor.toString().equals("")) {
                uiConfig.setSureMessageBgColor(sureMessageBgColor.toString());
            }
            //打开nfc弹窗 按钮颜色
            if (openNfcBtnTextColor != null && !openNfcBtnTextColor.toString().equals("")) {
                uiConfig.setOpenNfcBtnTextColor(openNfcBtnTextColor.toString());
            }
            //打开nfc弹窗 按钮背景颜色
            if (openNfcBtnBgColor != null && !openNfcBtnBgColor.toString().equals("")) {
                uiConfig.setBottomTipTextColor(openNfcBtnBgColor.toString());
            }


        } catch (JSONException e) {
            uiConfig = null;
            e.printStackTrace();
        }
        return uiConfig;
    }

    @ReactMethod
    public void showResultActivity(String identityCardData) {
        MLog.d(Contants.LOG_EVENT, "identityCardData~" + identityCardData);
        IdDetailBean idDetailBean = (IdDetailBean) GsonUtils.jsonToObj(identityCardData, IdDetailBean.class);
        IdentityCard identityCard = new IdentityCard(idDetailBean.getName(), idDetailBean.getSex(), idDetailBean.getNation(), idDetailBean.getBirthDate(), idDetailBean.getAddress(), idDetailBean.getIdnum(),
                idDetailBean.getSigningOrganization(), idDetailBean.getBeginTime() + idDetailBean.getEndTime(), idDetailBean.getPicture());
        LPYReadCardFactory.getPageRouterSE().toResultPage(ActivityNavigator.navigator().getLastActivity(), identityCard);
    }


    @ReactMethod
    public void getNfcState(Callback callback) {
        callback.invoke(LPYReadCardFactory.getLPYReadCardSE().isNFCAvailable(ActivityNavigator.navigator().getLastActivity()));
    }


    @ReactMethod
    public void showLoadingView() {
        ActivityNavigator.navigator().getLastActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                LPYReadCardFactory.getPageRouterSE().showLoading();
            }
        });

    }

    @ReactMethod
    public void hideLoadingView() {
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
