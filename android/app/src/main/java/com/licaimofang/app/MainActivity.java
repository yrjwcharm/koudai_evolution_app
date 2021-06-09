/*
 * @Date: 2020-12-23 16:39:50
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-06-08 18:50:53
 * @Description: 
 */
package com.licaimofang.app;
import android.os.Bundle; // here
import org.devio.rn.splashscreen.SplashScreen; // here
import com.facebook.react.ReactActivity;
import android.os.Build;
import android.webkit.WebView;
public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "EvolutionApp";
  }
  @Override
  protected void onCreate(Bundle savedInstanceState) {
     if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) { //webview 调试
        WebView.setWebContentsDebuggingEnabled(true);
    }
      SplashScreen.show(this,R.style.SplashScreenTheme);  // here
      super.onCreate(savedInstanceState);
  }
}
