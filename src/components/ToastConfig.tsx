import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';
const toastConfig = {
  /*
    Overwrite 'success' type,
    by modifying the existing `BaseToast` component
  */
  success: props => (
    <BaseToast
      {...props}
      // style={{borderLeftColor: 'pink'}}
      // contentContainerStyle={{paddingHorizontal: 15}}
      text1Style={{
        fontSize: 15,
        fontFamily: 'Apple SD Gothic Neo',
        // fontWeight: '400',
      }}
      text2Style={{
        fontFamily: 'Apple SD Gothic Neo',
      }}
    />
  ),
  /*
    Overwrite 'error' type,
    by modifying the existing `ErrorToast` component
  */
  error: props => (
    <ErrorToast
      {...props}
      text1Style={{
        fontSize: 17,
        fontFamily: 'Apple SD Gothic Neo',
      }}
      text2Style={{
        fontSize: 15,
        fontFamily: 'Apple SD Gothic Neo',
      }}
    />
  ),
  /*
    Or create a completely new type - `tomatoToast`,
    building the layout from scratch.

    I can consume any custom `props` I want.
    They will be passed when calling the `show` method (see below)
  */
  tomatoToast: ({text1, props}) => (
    <View style={{height: 60, width: '100%', backgroundColor: 'tomato'}}>
      <Text>{text1}</Text>
      <Text>{props.uuid}</Text>
    </View>
  ),
};
