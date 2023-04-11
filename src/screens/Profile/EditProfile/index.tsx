import React, {useCallback, useEffect, useState} from 'react';
import {Pressable, ScrollView, View} from 'react-native';
import {Button, makeStyles, Text} from '@rneui/themed';
import {StackScreenProps} from '@react-navigation/stack';
import {HeaderBackButton} from '@react-navigation/elements';
import Avatar from '@components/Avatar';
import {HelperText, TextInput} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {apiInstance, getCsrfToken} from '@utils/Networking';
import ImagePicker, {Image} from 'react-native-image-crop-picker';
import Toast from 'react-native-toast-message';
import {useAppDispatch} from '@redux/store/RootStore';
import {editAccount} from '@redux/reducer/authReducer';
import {StackActions} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CheckButton from '@components/buttons/CheckButton';
import BackButton from '@components/BackButton';
import ProgressModal from '@screens/Upload/ProgressModal';

type EditProfileProps = StackScreenProps<RootStackParamList, 'EditProfile'>;

const EditProfile: React.FC<EditProfileProps> = ({navigation, route}) => {
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const [id, setId] = useState(route.params.id);
  const [nickname, setNickname] = useState(route.params.nickname);
  const [description, setDescription] = useState(route.params.description);
  const [link, setLink] = useState(route.params.link);
  const [avatar, setAvatar] = useState<Image>();
  const [csrfToken, setCsrfToken] = useState<string>();
  const [progressModalVisible, setProgressModalVisible] = useState(false);

  const dispatch = useAppDispatch();
  useEffect(() => {
    getCsrfToken.then(token => setCsrfToken(token));
  }, []);
  console.log(route.params);
  const openImagePicker = useCallback(() => {
    ImagePicker.openPicker({
      mediaType: 'photo',
      cropping: true,
      multiple: false,
      writeTempFile: true,
      includeExif: true,
      width: 512,
      height: 512,
      cropperCircleOverlay: true,
    }).then(setAvatar);
  }, []);
  const submit = useCallback(() => {
    if (!progressModalVisible) {
      setProgressModalVisible(true);
      const form = new FormData();
      form.append('id', id);
      form.append('nickname', nickname);
      form.append('link', link);
      form.append('description', description);
      if (avatar) {
        form.append('avatar', {
          uri: avatar.path,
          type: avatar.mime,
          name:
            avatar.filename ||
            avatar.path.substring(
              avatar.path.lastIndexOf('/') + 1,
              avatar.path.length,
            ),
        });
      }
      form.append('_csrf', csrfToken);
      apiInstance
        .post<response<ISession>>('/api/account/edit', form, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
          timeout: 180000,
        })
        .then(response => {
          switch (response.data.code) {
            case 200:
              dispatch(editAccount(response.data.data));
              navigation.dispatch(
                StackActions.replace(
                  // stale: false,
                  // stale: false,
                  'My',
                ),
              );
              navigation.navigate('ProfileTab');
              break;
            case 409:
              Toast.show({
                type: 'error',
                text1: '중복된 아이디 입니다.',
                position: 'bottom',
              });
              break;
          }
        })
        .catch(error => {
          Toast.show({
            type: 'error',
            text1: 'Unknown Error Occurred!',
            position: 'bottom',
          });
          setProgressModalVisible(false);
          console.log('error', error);
        });
    }
  }, [
    id,
    nickname,
    link,
    description,
    avatar,
    csrfToken,
    dispatch,
    navigation,
  ]);
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.backButton,
          {
            justifyContent: 'space-between',
            paddingTop: insets.top || 11,
            paddingBottom: 11,
            alignItems: 'center',
          },
        ]}>
        <View style={{padding: 5, paddingHorizontal: 10}}>
          <BackButton onPress={() => navigation.goBack()} color={'white'} />
        </View>
        <View
          style={{
            padding: 5,
            paddingHorizontal: 10,
            marginRight: insets.right || 5,
          }}>
          <CheckButton
            onPress={submit}
            color={'white'}
            size={28}
            label={'수정'}
            // disabled={title.length === 0 && !thumbnail && !pdf}
          />
        </View>
      </View>
      <KeyboardAwareScrollView>
        <View style={styles.inputContainer}>
          {/*<View style={styles.backButton}>*/}
          {/*  <HeaderBackButton*/}
          {/*    tintColor={'white'}*/}
          {/*    onPress={() => navigation.goBack()}*/}
          {/*  />*/}
          {/*</View>*/}
          <Pressable
            onPress={openImagePicker}
            style={{
              marginBottom: 12,
              // borderWidth: 1,
              borderRadius: 100,
              // borderColor: '#cbe244',
            }}>
            <Avatar
              avatar={avatar ? {filepath: avatar.path} : route.params.avatar}
            />
          </Pressable>
          <View style={{marginBottom: 15}}>
            <Text style={styles.nicknameText}>{nickname}</Text>
          </View>
          {/*<Button*/}
          {/*  buttonStyle={{*/}
          {/*    paddingVertical: 14,*/}
          {/*    paddingHorizontal: 40,*/}
          {/*  }}*/}
          {/*  containerStyle={{borderRadius: 24, marginBottom: 24}}*/}
          {/*  onPress={submit}*/}
          {/*  title={'프로필 수정'}*/}
          {/*/>*/}
          <View style={styles.inputField}>
            <TextInput
              theme={{
                colors: {
                  onSurfaceVariant: '#fff',
                },
              }}
              label="아이디"
              dense={true}
              style={styles.textInput}
              contentStyle={styles.textInputContent}
              activeUnderlineColor={'#fff'}
              autoCapitalize={'none'}
              autoCorrect={false}
              returnKeyType={'next'}
              underlineColor={'#fff'}
              onChangeText={setId}
              value={id}
              textColor={'#fff'}
              selectionColor={'#fff'}
              cursorColor={'#fff'}
            />
            <HelperText
              type={'info'}
              visible
              style={{paddingHorizontal: 0}}
              theme={{
                colors: {
                  onSurfaceVariant: '#777',
                },
              }}>
              숫자, 영소문자 및 _ 최소 4자 최대 24자 가능합니다
            </HelperText>
            <TextInput
              theme={{
                colors: {
                  onSurfaceVariant: '#fff',
                },
              }}
              label="채널명"
              dense={true}
              style={styles.textInput}
              contentStyle={styles.textInputContent}
              activeUnderlineColor={'#fff'}
              keyboardType={'email-address'}
              autoCapitalize={'none'}
              autoCorrect={false}
              returnKeyType={'next'}
              underlineColor={'#fff'}
              onChangeText={setNickname}
              value={nickname}
              textColor={'#fff'}
              selectionColor={'#fff'}
              cursorColor={'#fff'}
            />
            <HelperText
              type={'info'}
              visible
              style={{paddingHorizontal: 0}}
              theme={{
                colors: {
                  onSurfaceVariant: '#777',
                },
              }}>
              최소 2자 최대 24자 가능합니다
            </HelperText>
            <TextInput
              theme={{
                colors: {
                  onSurfaceVariant: '#fff',
                },
              }}
              label="내 소개"
              dense={true}
              style={styles.textInput}
              contentStyle={styles.textInputContent}
              activeUnderlineColor={'#fff'}
              autoCapitalize={'none'}
              autoCorrect={false}
              multiline={true}
              underlineColor={'#fff'}
              onChangeText={setDescription}
              value={description}
              textColor={'#fff'}
              selectionColor={'#fff'}
              cursorColor={'#fff'}
            />
            <TextInput
              theme={{
                colors: {
                  onSurfaceVariant: '#fff',
                },
              }}
              label="링크"
              dense={true}
              style={styles.textInput}
              contentStyle={styles.textInputContent}
              activeUnderlineColor={'#fff'}
              multiline={true}
              underlineColor={'#fff'}
              onChangeText={setLink}
              value={link}
              textColor={'#fff'}
              selectionColor={'#fff'}
              cursorColor={'#fff'}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
      <ProgressModal
        progressModalVisible={progressModalVisible}
        setProgressModalVisible={setProgressModalVisible}
      />
    </View>
  );
};
const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: 'black',
    flex: 1,
  },
  inputContainer: {
    flex: 1,
    // backgroundColor: theme.colors.primary,
    // paddingHorizontal: 35,
    alignItems: 'center',
  },
  nicknameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.black,
  },
  submitButton: {
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 40,
  },
  backButton: {
    // alignSelf: 'flex-start',
    flexDirection: 'row',
    // paddingVertical: 11,
  },
  inputField: {
    // flex: 1,
    width: '100%',
    paddingTop: 3,
    paddingBottom: 15,
    paddingHorizontal: 20,
    // backgroundColor: theme.colors.black,
    // borderRadius: 20,
  },
  textInput: {
    // backgroundColor: '#fff',
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    fontSize: 13,
  },
  textInputContent: {
    // flex: 1,
    // width: '100%',
    // paddingHorizontal: 0,
    backgroundColor: 'transparent',
    color: theme.colors.black,
    fontFamily: 'Apple SD Gothic Neo',
    textAlignVertical: 'bottom',
    // alignSelf: 'stretch',
    textAlign: 'left',
    fontSize: 13,
    paddingLeft: 0,
    margin: 0,
    paddingBottom: 0,
  },
  label: {
    marginTop: 3,
    fontSize: 12,
  },
}));
export default EditProfile;
