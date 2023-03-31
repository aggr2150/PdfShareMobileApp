import {
  AppOpenAd,
  TestIds,
  AdEventType,
  InterstitialAd,
} from 'react-native-google-mobile-ads';
import {
  getTrackingStatus,
  requestTrackingPermission,
} from 'react-native-tracking-transparency';
import {Platform} from 'react-native';
const adUnitId = __DEV__
  ? TestIds.INTERSTITIAL
  : Platform.OS === 'ios'
  ? 'ca-app-pub-5769586542571369/5825127388'
  : 'ca-app-pub-5769586542571369/1979012021';
// const interstitial = getTrackingStatus().then(() => {
//   return InterstitialAd.createForAdRequest(adUnitId, {
//     requestNonPersonalizedAdsOnly: true,
//   });
// });
// let interstitial = InterstitialAd.createForAdRequest(adUnitId, {
//   requestNonPersonalizedAdsOnly: true,
// });
// interstitial.load();
// requestTrackingPermission();
export default class InterstitialAdsController {
  static interstitial: InterstitialAd;
  static initialize = async () => {
    const trackingStatus = await requestTrackingPermission();

    this.interstitial = InterstitialAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly:
        trackingStatus !== 'authorized' && trackingStatus !== 'unavailable',
    });
    console.log('initialized');
  };

  static requestAds = async () => {
    if (this.interstitial.loaded) {
      this.interstitial.show().then();
    } else {
      this.interstitial.load();
    }
  };
}
