import {
  AppOpenAd,
  TestIds,
  AdEventType,
  InterstitialAd,
} from 'react-native-google-mobile-ads';
import {Platform} from 'react-native';
const adUnitId = __DEV__
  ? TestIds.INTERSTITIAL
  : Platform.OS === 'ios'
  ? 'ca-app-pub-9881103194147827/6239031712'
  : 'ca-app-pub-9881103194147827/1836752279';
const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
});
interstitial.load();
export default class InterstitialAdsController {
  static requestAds = () => {
    if (interstitial.loaded) {
      interstitial.show().then();
    } else {
      interstitial.load();
    }
  };
}
