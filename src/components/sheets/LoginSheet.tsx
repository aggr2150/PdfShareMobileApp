import {View} from 'react-native';
import {makeStyles, Text} from '@rneui/themed';
import ActionSheet, {
  ActionSheetRef,
  SheetProps,
} from 'react-native-actions-sheet';
import React, {useEffect, useRef, useState} from 'react';
import ToggleBtn from '@components/ToggleBtn';
import {CommonActions, useNavigation} from '@react-navigation/native';
import FirstScene from '@components/sheets/LoginSheet/FirstScene';
import SecondScene from '@components/sheets/LoginSheet/SecondScene';
import AnimatedPages from '@components/AnimatedPages';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

enum EnumSelectedIndex {
  '로그인',
  '회원가입',
}
interface loginSheetPayload {
  closable?: boolean;
}

const LoginSheet: React.FC<SheetProps<loginSheetPayload>> = props => {
  const styles = useStyles(props);
  const navigation = useNavigation();
  const [selectedIndex, setSelectedIndex] = useState<EnumSelectedIndex>(
    EnumSelectedIndex.로그인,
  );
  const [closable, setClosable] = useState(!!props.payload?.closable);

  useEffect(() => {
    if (props.payload?.closable === false && closable) {
      sheetRef.current?.hide();
      //   navigation.dispatch(
      //     CommonActions.reset({
      //       routes: [{name: 'Tabs'}],
      //     }),
      //   );
    }
  }, [closable, navigation, props.payload?.closable]);

  const sheetRef = useRef<ActionSheetRef>(null);
  return (
    <ActionSheet
      ref={sheetRef}
      // closable={false}
      id={props.sheetId}
      // headerAlwaysVisible={false}
      gestureEnabled={true}
      CustomHeaderComponent={<></>}
      statusBarTranslucent
      closable={closable}
      // overdrawSize={0}
      // isModal={false}
      backgroundInteractionEnabled={!closable}
      // indicatorStyle={{height: 100}}
      // drawUnderStatusBar={true}
      keyboardHandlerEnabled={true}
      useBottomSafeAreaPadding={true}
      containerStyle={{
        ...styles.container,
        bottom: !closable ? 25 : 0,
      }}>
      <View
        style={{
          // paddingBottom: 35,
          maxHeight: '100%',
          flexGrow: 1,
        }}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Every Pdf 로그인</Text>
        </View>

        <View
          style={{
            marginBottom: 7,
          }}>
          <ToggleBtn
            labelText={['로그인', '회원가입']}
            splitCenter={false}
            selectedIndex={selectedIndex}
            onPress={setSelectedIndex}
          />
        </View>
        <AnimatedPages
          setClosable={setClosable}
          selectedIndex={selectedIndex}
          SceneMap={[FirstScene, SecondScene]}
          setSelectedIndex={setSelectedIndex}
        />
      </View>
    </ActionSheet>
  );
};
const useStyles = makeStyles(theme => ({
  submitButton: {
    borderRadius: 20,
  },
  container: {
    backgroundColor: theme.colors.sheetsBackground,
    paddingHorizontal: 35,
    // justifyContent: 'center',
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },
  header: {
    margin: 30,
    alignItems: 'center',
  },
  textInput: {
    marginBottom: 7,
    backgroundColor: theme.colors.black,
    color: theme.colors.white,
    // alignSelf: 'stretch',
    textAlign: 'left',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 20,
    fontSize: 14,
    // color: theme.colors.white,
  },
  headerText: {
    fontSize: 17,
    color: theme.colors.black,
  },
}));
export default LoginSheet;
