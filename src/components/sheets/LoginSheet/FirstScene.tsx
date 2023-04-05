import {TextInput, TouchableOpacity, View} from 'react-native';
import {Button, Input, makeStyles, Text} from '@rneui/themed';
import Keychain from 'react-native-keychain';
import {apiInstance, getCsrfToken} from '@utils/Networking';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {Input as BaseInput} from '@rneui/base/dist/Input/Input';
import {SheetManager} from 'react-native-actions-sheet';
import {useAppDispatch} from '@redux/store/RootStore';
import {signIn} from '@redux/reducer/authReducer';
import Toast from 'react-native-toast-message';
import {blockUserSetAll} from '@redux/reducer/blocksReducer';

const FirstScene = props => {
  const styles = useStyles(props);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const passwordRef = useRef<BaseInput & TextInput>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [csrfToken, setCsrfToken] = useState<string>();
  const dispatch = useAppDispatch();
  useEffect(() => {
    getCsrfToken.then(token => setCsrfToken(token));
  }, []);
  const submit = useCallback(() => {
    apiInstance
      .post<response<ISession>>('/api/auth/signIn', {
        _csrf: csrfToken,
        id: email,
        password: password,
      })
      .then(response => {
        switch (response.data.code) {
          case 200:
            dispatch(signIn(response.data.data));
            Keychain.setGenericPassword(email, password).then(r =>
              console.log(r),
            );
            props.setClosable(true);
            apiInstance.post('/api/account/block/list').then(result => {
              if (result.data.code === 200) {
                if (result.data.data) {
                  dispatch(blockUserSetAll(result.data.data));
                }
              }
            });
            SheetManager.hide('loginSheet').then(() => {
              // navigation.dispatch(
              //   CommonActions.reset({
              //     routes: [{name: 'Tabs'}],
              //   }),
              // );
            });
            break;
          case 422:
            Toast.show({
              type: 'error',
              text1: '올바른 이메일과 비밀번호를 입력해주세요.',
              position: 'bottom',
            });
            break;
          case 440:
            Toast.show({
              type: 'error',
              text1: '비밀번호가 일치하지 않습니다.',
              position: 'bottom',
            });
            break;
        }
      });
  }, [csrfToken, dispatch, email, navigation, password, props]);

  return (
    <View>
      <View>
        <Input
          onChangeText={setEmail}
          style={styles.textInput}
          placeholder={'이메일 주소'}
          placeholderTextColor={'#60b630'}
          inputContainerStyle={{borderBottomWidth: 0}}
          renderErrorMessage={false}
          containerStyle={{paddingHorizontal: 0}}
          inputStyle={{margin: 0}}
          keyboardType={'email-address'}
          autoCorrect={false}
          autoCapitalize={'none'}
          returnKeyType={'next'}
          onSubmitEditing={() => passwordRef.current?.focus()}
        />
        <Input
          onChangeText={setPassword}
          ref={passwordRef}
          style={styles.textInput}
          placeholder={'비밀번호'}
          placeholderTextColor={'#60b630'}
          inputContainerStyle={{borderBottomWidth: 0}}
          renderErrorMessage={false}
          containerStyle={{paddingHorizontal: 0, margin: 0}}
          inputStyle={{margin: 0}}
          secureTextEntry={true}
          autoCorrect={false}
          autoCapitalize={'none'}
          returnKeyType={'done'}
          onSubmitEditing={submit}
        />
      </View>
      <View>
        <Button
          buttonStyle={{minHeight: 40}}
          containerStyle={styles.submitButton}
          onPress={submit}
          titleStyle={styles.labelText}>
          로그인
        </Button>
      </View>
      <View
        style={{
          margin: 12,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => {
            props.setClosable(true);
            navigation.navigate('ResetPassword');
          }}>
          <Text>비밀번호 찾기</Text>
        </TouchableOpacity>
        <Text> / </Text>
        <TouchableOpacity
          onPress={() => {
            props.setClosable(true);
            navigation.dispatch(
              CommonActions.reset({
                // stale: true,
                // stale: false,
                // index: 0,
                routes: [{name: 'Tabs'}],
              }),
            );
          }}>
          <Text>홈으로 가기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const useStyles = makeStyles(theme => ({
  submitButton: {
    borderRadius: 20,
    minHeight: 40,
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
    color: theme.colors.tertiary,
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
  labelText: {
    fontSize: 15,
    color: theme.colors.black,
  },
}));
export default FirstScene;
