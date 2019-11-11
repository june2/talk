package host.exp.exponent;

import android.annotation.TargetApi;
import android.os.Build;
import android.os.Bundle;
import android.support.annotation.NonNull;

import com.facebook.react.ReactPackage;
import com.facebook.react.modules.core.PermissionAwareActivity;
import com.facebook.react.modules.core.PermissionListener;

import org.unimodules.core.interfaces.Package;

import java.util.List;

import javax.annotation.Nullable;

import host.exp.exponent.experience.DetachActivity;
import host.exp.exponent.generated.DetachBuildConstants;

public class MainActivity extends DetachActivity implements PermissionAwareActivity {

  @Nullable
  private PermissionListener permissionListener;

  @Override
  public String publishedUrl() {
    return "exp://exp.host/@june4536/talk";
  }

  @Override
  public String developmentUrl() {
    return DetachBuildConstants.DEVELOPMENT_URL;
  }

  @Override
  public List<ReactPackage> reactPackages() {
    return ((MainApplication) getApplication()).getPackages();
  }

  @Override
  public List<Package> expoPackages() {
    return ((MainApplication) getApplication()).getExpoPackages();
  }

  @Override
  public boolean isDebug() {
    return BuildConfig.DEBUG;
  }

  @Override
  public Bundle initialProps(Bundle expBundle) {
    // Add extra initialProps here
    return expBundle;
  }

  @TargetApi(Build.VERSION_CODES.M)
  public void requestPermissions(String[] permissions, int requestCode, PermissionListener listener) {
    permissionListener = listener;
    requestPermissions(permissions, requestCode);
  }

  @Override
  public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
    if (permissionListener != null) {
      permissionListener.onRequestPermissionsResult(requestCode, permissions, grantResults);
    }
  }
}
