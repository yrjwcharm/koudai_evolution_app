package com.licaimofang.TtdRecord;

import android.text.TextUtils;

import androidx.annotation.NonNull;

import com.alibaba.fastjson.JSONArray;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.licaimofang.readcard.utils.MLog;

import org.jetbrains.annotations.NotNull;

import java.util.List;
import com.ttd.qarecordlib.IQARecordInitListener;
import com.ttd.qarecordlib.IRecordEventHandler;
import com.ttd.qarecordlib.QATalkingEntity;
import com.ttd.qarecordlib.RecordEntity;
import com.ttd.qarecordlib.TtdQARecordSDK;

import static com.facebook.react.bridge.UiThreadUtil.runOnUiThread;

public class RecordModule extends ReactContextBaseJavaModule {
    private static ReactApplicationContext reactContext;
    public RecordModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }
    @NonNull
    @NotNull
    @Override
    public String getName() {
        return "RecordManager";
    }

    //  初始化
    @ReactMethod
    public void init(String appid, Boolean isDebug, Callback successCallBack,Callback errorCallBack){
        TtdQARecordSDK.getInstance().initSDK(getCurrentActivity(),appid,isDebug, new IQARecordInitListener() {
            @Override
            public void onSuccess() {
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        successCallBack.invoke("初始化成功");
                        MLog.d("Record", "onSuccess-----");
                    }
                });

            }

            @Override
            public void onError(int code, String msg) {
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        errorCallBack.invoke(msg);
                        MLog.d("Record", String.format("初始化失败！错误码：%1$d，错误信息：%2$s",code,msg));
                    }
                });
            }
        });
    }
    //开启双录


    @ReactMethod
    public void startRecord(String serialNo,String ttdOrderNo,String talking,Callback successCallback,Callback errorCallback) {
        RecordEntity data = new RecordEntity();
//        data.setSerialNo("ttd"+System.currentTimeMillis());
//        QATalkingEntity[] talkings = new QATalkingEntity[1];
//        talkings[0] =  new QATalkingEntity("您是否确认购买某某产品并已确认风险？",null);

        List<QATalkingEntity> list = JSONArray.parseArray(talking,QATalkingEntity.class);
        QATalkingEntity[] entities = list.toArray(new QATalkingEntity[list.size()]);

        data.setTalkings(entities);
        data.setSerialNo(serialNo);
        data.setTtdOrderNo(ttdOrderNo);
        int result = TtdQARecordSDK.getInstance().startRecord(getCurrentActivity(), data, new IRecordEventHandler() {
            @Override
            public void onComplate(RecordEntity data, int endType) {
                successCallback.invoke(data.getSerialNo(),data.getTtdOrderNo());
                MLog.d("startRecord", String.format("业务号：%1$s\n"
                                +"妥妥递订单号：%2$s\n"
                                +"录制结果：%3$s",
                        data.getSerialNo(),
                        TextUtils.isEmpty(data.getTtdOrderNo()) ? "未设置": data.getTtdOrderNo(),
                        endType == 0 ? "成功" : (endType == 1 ? "失败" : "取消")));
            }

            @Override
            public void onSuccess(String serialNo) {
                successCallback.invoke(serialNo);

            }
        });
        if(result != 0){
            errorCallback.invoke(result == 1002 ? "参数不正确（话术或业务号为空）" : "初始化未完成，请稍后");
            MLog.d("startRecord", result == 1002 ? "参数不正确（话术或业务号为空）" : "初始化未完成，请稍后");
        };
    }
}
