import {TextInput, useWindowDimensions, View} from 'react-native';
import {makeStyles, Text} from '@rneui/themed';
import {Input as BaseInput} from '@rneui/base';
import ActionSheet, {
  ActionSheetRef,
  SheetProps,
} from 'react-native-actions-sheet';
import React, {useEffect, useRef, useState} from 'react';
import Orientation from 'react-native-orientation-locker';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ToggleBtn from '@components/ToggleBtn';
import {useNavigation} from '@react-navigation/native';
import {apiInstance} from '@utils/Networking';
import FirstScene from '@components/sheets/LoginSheet/FirstScene';
import SecondScene from '@components/sheets/LoginSheet/SecondScene';
import AnimatedPages from '@components/AnimatedPages';

enum EnumSelectedIndex {
  '로그인',
  '회원가입',
}
interface loginSheetPayload {
  closable?: boolean;
}

const LoginSheet: React.FC<SheetProps<loginSheetPayload>> = props => {
  const styles = useStyles(props);
  const [orientation, setOrientation] = useState<string>();
  useEffect(() => {
    return Orientation.addOrientationListener(setOrientation);
  }, []);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [selectedIndex, setSelectedIndex] = useState<EnumSelectedIndex>(
    EnumSelectedIndex.로그인,
  );
  const {height, width} = useWindowDimensions();
  const passwordRef = useRef<BaseInput & TextInput>(null);
  const [closable, setClosable] = useState(!!props.payload?.closable);

  useEffect(() => {
    if (props.payload?.closable === false && closable) {
      sheetRef.current?.hide();
    }
  }, [closable, props.payload?.closable]);

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
        ...styles.container, //, paddingBottom: insets.bottom
      }}>
      <View
        style={{
          paddingBottom: 35,
          maxHeight: '100%',
          flexGrow: 1,
        }}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Hello World</Text>
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
        {/*<View>*/}
        {/*  <Input*/}
        {/*    style={styles.textInput}*/}
        {/*    placeholder={'이메일 주소'}*/}
        {/*    placeholderTextColor={'#99c729'}*/}
        {/*    inputContainerStyle={{borderBottomWidth: 0}}*/}
        {/*    renderErrorMessage={false}*/}
        {/*    containerStyle={{paddingHorizontal: 0}}*/}
        {/*    inputStyle={{margin: 0}}*/}
        {/*    keyboardType={'email-address'}*/}
        {/*    autoCorrect={false}*/}
        {/*    returnKeyType={'next'}*/}
        {/*    onSubmitEditing={() => passwordRef.current?.focus()}*/}
        {/*  />*/}
        {/*  <Input*/}
        {/*    ref={passwordRef}*/}
        {/*    style={styles.textInput}*/}
        {/*    placeholder={'비밀번호'}*/}
        {/*    placeholderTextColor={'#99c729'}*/}
        {/*    inputContainerStyle={{borderBottomWidth: 0}}*/}
        {/*    renderErrorMessage={false}*/}
        {/*    containerStyle={{paddingHorizontal: 0, margin: 0}}*/}
        {/*    inputStyle={{margin: 0}}*/}
        {/*    secureTextEntry={true}*/}
        {/*    autoCorrect={false}*/}
        {/*    returnKeyType={'done'}*/}
        {/*  />*/}
        {/*</View>*/}
        {/*<View>*/}
        {/*  <Button*/}
        {/*    containerStyle={styles.submitButton}*/}
        {/*    onPress={async () => {*/}
        {/*      const credentials = await Keychain.getGenericPassword();*/}
        {/*      console.log(credentials);*/}
        {/*      if (credentials) {*/}
        {/*        console.log(*/}
        {/*          'Credentials successfully loaded for user ' + credentials,*/}
        {/*        );*/}
        {/*        apiInstance.defaults.auth = {*/}
        {/*          username: credentials.username,*/}
        {/*          password: credentials.password,*/}
        {/*        };*/}
        {/*        apiInstance*/}
        {/*          .post<{*/}
        {/*            code: number;*/}
        {/*            status: string;*/}
        {/*            data: {*/}
        {/*              deviceToken: string;*/}
        {/*            };*/}
        {/*          }>(*/}
        {/*            'https://everypdf.cc/api/signIn',*/}
        {/*            {},*/}
        {/*            {*/}
        {/*              xsrfCookieName: '',*/}
        {/*              auth: {*/}
        {/*                username: credentials.username,*/}
        {/*                password: credentials.password,*/}
        {/*              },*/}
        {/*            },*/}
        {/*          )*/}
        {/*          .then(result => {*/}
        {/*            console.log(*/}
        {/*              'result',*/}
        {/*              result,*/}
        {/*              result.data,*/}
        {/*              apiInstance.defaults.headers,*/}
        {/*            );*/}
        {/*          });*/}
        {/*      } else {*/}
        {/*        Keychain.setGenericPassword('aaa', 'aa').then(r =>*/}
        {/*          console.log(r),*/}
        {/*        );*/}
        {/*      }*/}

        {/*      // setClosable(true);*/}
        {/*      // // SheetManager.hideAll();*/}
        {/*      // sheetRef.current.hide();*/}
        {/*      // navigation.reset({routes: [{name: 'Tabs'}]});*/}
        {/*    }}>*/}
        {/*    aaa*/}
        {/*  </Button>*/}
        {/*</View>*/}
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
