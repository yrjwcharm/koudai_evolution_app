/*
 * @Date: 2020-12-23 16:39:50
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-03-18 18:03:49
 * @Description: 
 */
package com.licaimofang.app.wxapi;

import android.app.Activity;
import android.os.Bundle;
import com.theweflex.react.WeChatModule;

public class WXEntryActivity extends Activity {
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    WeChatModule.handleIntent(getIntent());
    finish();
  }
}