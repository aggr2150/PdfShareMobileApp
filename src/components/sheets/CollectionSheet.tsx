import {
  Platform,
  Pressable,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import {Button, Input, makeStyles, Text} from '@rneui/themed';
import ActionSheet, {
  SheetManager,
  SheetProps,
} from 'react-native-actions-sheet';
import React, {useCallback, useEffect, useState} from 'react';
import Orientation from 'react-native-orientation-locker';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ButtonGroup} from '@rneui/themed';
import ToggleBtn from '@components/ToggleBtn';
import {useNavigation} from '@react-navigation/native';
import Separator from '@components/Seperator';
import Avatar from '@components/Avatar';
import BoxIcon from '@assets/icon/box.svg';
import {apiInstance, getCsrfToken} from '@utils/Networking';
import {postAdded} from '@redux/reducer/postsReducer';
import Toast from 'react-native-toast-message';

const CollectionSheet: React.FC<SheetProps> = props => {
  const styles = useStyles(props);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const {height, width} = useWindowDimensions();
  const [csrfToken, setCsrfToken] = useState<string>();
  const [title, setTitle] = useState<string>('');

  useEffect(() => {
    getCsrfToken.then(token => setCsrfToken(token));
  }, []);
  const submit = useCallback(() => {
    apiInstance
      .post('/api/collection/create', {title, _csrf: csrfToken})
      .then(response => {
        if (response.data.code === 200) {
          SheetManager.hide('collectionSheet').then();
        } else {
          Toast.show({
            type: 'error',
            text1: 'Unknown Error Occurred!',
            position: 'bottom',
          });
        }
      });
  }, [csrfToken, title]);

  return (
    <ActionSheet
      id={props.sheetId}
      // headerAlwaysVisible={false}
      gestureEnabled={true}
      CustomHeaderComponent={<></>}
      statusBarTranslucent
      overdrawSize={0}
      isModal={true}
      // indicatorStyle={{height: 100}}
      drawUnderStatusBar={true}
      useBottomSafeAreaPadding={true}
      containerStyle={styles.container}>
      <View>
        <View style={styles.header}>
          <Text style={styles.headerText}>콜렉션 생성</Text>
        </View>
        <Separator style={{marginVertical: 10}} />
        <View
          style={{
            marginHorizontal: 32,
            marginVertical: 35,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#4c4c4c',
            borderRadius: 100,
            overflow: 'hidden',
          }}>
          <View
            style={{
              padding: 20,
              paddingHorizontal: 32,
              flex: 1,
              backgroundColor: '#4c4c4c',
            }}>
            <TextInput
              style={{
                fontSize: 13,
                padding: 0,
                color: '#fff',
              }}
              onChangeText={setTitle}
              onSubmitEditing={submit}
              placeholderTextColor={'#fff'}
              placeholder={'콜렉션 이름을 입력하세요.'}
            />
          </View>
          <Pressable
            onPress={submit}
            style={{
              paddingHorizontal: 28,
              backgroundColor: '#99c729',
              // flex: 1,
            }}>
            <View style={{flex: 1, justifyContent: 'center'}}>
              <Text>완료</Text>
            </View>
          </Pressable>
        </View>
      </View>
    </ActionSheet>
  );
};
const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme.colors.background,
    // justifyContent: 'center',
    borderTopRightRadius: 45,
    borderTopLeftRadius: 45,
  },
  submitButton: {
    borderRadius: 20,
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
export default CollectionSheet;
