package com.licaimofang.app;
import android.os.Bundle; // here
import org.devio.rn.splashscreen.SplashScreen; // here
import com.facebook.react.ReactActivity;

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
      SplashScreen.show(this,R.style.SplashScreenTheme);  // here
      super.onCreate(savedInstanceState);
  }

}
