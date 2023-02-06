import React, {useCallback, useEffect, useState} from 'react';
import {Pressable, ScrollView, View} from 'react-native';
import {Button, makeStyles, Text} from '@rneui/themed';
import {StackScreenProps} from '@react-navigation/stack';
import {HeaderBackButton} from '@react-navigation/elements';
import Avatar from '@components/Avatar';
import {TextInput} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {apiInstance, getCsrfToken} from '@utils/Networking';
import ImagePicker, {Image} from 'react-native-image-crop-picker';
import Toast from 'react-native-toast-message';
import {useAppDispatch} from '@redux/store/RootStore';
import {editAccount} from '@redux/reducer/authReducer';
import {StackActions} from '@react-navigation/native';

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

  const dispatch = useAppDispatch();
  useEffect(() => {
    getCsrfToken.then(token => setCsrfToken(token));
  }, []);
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
    let form = new FormData();
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
        console.log('error', error);
      });
    // }
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
      <ScrollView>
        <View
          style={[
            styles.backButton,
            {
              paddingTop: insets.top || 11,
              paddingBottom: 11,
            },
          ]}>
          <HeaderBackButton
            tintColor={'white'}
            onPress={() => navigation.goBack()}
          />
        </View>
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
            }}>
            <Avatar
              avatar={avatar ? {filepath: avatar.path} : route.params.avatar}
            />
          </Pressable>
          <View style={{marginBottom: 15}}>
            <Text style={styles.nicknameText}>{nickname}</Text>
          </View>
          <Button
            buttonStyle={{
              borderRadius: 24,
              paddingVertical: 14,
              paddingHorizontal: 40,
              marginBottom: 24,
            }}
            onPress={submit}
            title={'프로필 수정'}
          />
          <View style={styles.inputField}>
            <TextInput
              label="아이디"
              dense={true}
              style={styles.textInput}
              contentStyle={styles.textInputContent}
              activeUnderlineColor={'#99c729'}
              autoCapitalize={'none'}
              autoCorrect={false}
              returnKeyType={'next'}
              underlineColor={'#99c729'}
              onChangeText={setId}
              value={id}
            />
            <TextInput
              label="채널명"
              dense={true}
              style={styles.textInput}
              contentStyle={styles.textInputContent}
              activeUnderlineColor={'#99c729'}
              keyboardType={'email-address'}
              autoCapitalize={'none'}
              autoCorrect={false}
              returnKeyType={'next'}
              underlineColor={'#99c729'}
              onChangeText={setNickname}
              value={nickname}
            />
            <TextInput
              label="채널 링크"
              dense={true}
              style={styles.textInput}
              contentStyle={styles.textInputContent}
              activeUnderlineColor={'#99c729'}
              autoCapitalize={'none'}
              keyboardType={'url'}
              multiline={true}
              textColor={'#fff'}
              underlineColor={'#99c729'}
              onChangeText={setLink}
              value={link}
            />
            <TextInput
              label="내 소개"
              dense={true}
              style={styles.textInput}
              contentStyle={styles.textInputContent}
              activeUnderlineColor={'#99c729'}
              multiline={true}
              textColor={'#fff'}
              underlineColor={'#99c729'}
              onChangeText={setDescription}
              value={description}
            />
          </View>
        </View>
        {/*<Input />*/}
        {/*<Input />*/}
        {/*<Input />*/}
        {/*<Input />*/}
      </ScrollView>
    </View>
  );
};
const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme.colors.primary,
    flex: 1,
  },
  inputContainer: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 35,
    alignItems: 'center',
  },
  nicknameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.black,
  },
  counterText: {
    fontSize: 12,
    color: theme.colors.black,
  },
  submitButton: {
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 40,
  },
  backButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    // paddingVertical: 11,
  },
  inputField: {
    // flex: 1,
    width: '100%',
    paddingTop: 3,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.black,
    borderRadius: 20,
  },
  textInput: {
    backgroundColor: '#fff',
    paddingHorizontal: 0,
    fontSize: 13,
  },
  textInputContent: {
    // flex: 1,
    // width: '100%',
    // paddingHorizontal: 0,
    backgroundColor: theme.colors.black,
    color: theme.colors.secondary,
    fontFamily: 'Apple SD Gothic Neo',
    textAlignVertical: 'center',
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
