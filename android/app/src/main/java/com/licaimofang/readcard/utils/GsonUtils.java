/*
 * @Date: 2021-12-21 10:27:48
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-12-21 10:32:50
 * @Description: 
 */
package com.licaimofang.readcard.utils;

import com.google.gson.Gson;

/**
 * XJ  Gson对象 list 转String 工具类
 */
public class GsonUtils {

    /**
     * 对象转为字符串
     * @param o
     * @return
     */
    public static String objectToStr(Object o){
        Gson gson = new Gson();
        String str = gson.toJson(o);
        return str;
    }


    /**
     * 字符串转为对象
     * @return
     */
    public static Object strToObj(String str){
        Gson gson = new Gson();
        Object object = gson.fromJson(str, Object.class);
        return object;
    }

    /**
     * json转为对象
     * @param strJson
     * @param myClass
     * @return
     */
    public static Object jsonToObj(String strJson, Class myClass){
        Gson gson = new Gson();
        Object jsonObj = gson.fromJson(strJson,myClass);
        return jsonObj;
    }

}
