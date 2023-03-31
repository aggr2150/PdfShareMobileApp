import {Pressable, TextInput, View} from 'react-native';
import {makeStyles, Text} from '@rneui/themed';
import Separator from '@components/Seperator';
import ActionSheet, {
  ActionSheetRef,
  SheetProps,
} from 'react-native-actions-sheet';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {apiInstance, getCsrfToken} from '@utils/Networking';
import Toast from 'react-native-toast-message';

const RenameCollectionSheet: React.FC<SheetProps<ICollection>> = props => {
  const styles = useStyles(props);
  const [title, setTitle] = useState(props.payload?.title);
  const renameSheetRef = useRef<ActionSheetRef>(null);
  const [csrfToken, setCsrfToken] = useState<string>();
  useEffect(() => {
    getCsrfToken.then(token => setCsrfToken(token));
  }, []);
  const submit = useCallback(() => {
    apiInstance
      .post('/api/collection/edit', {
        collectionId: props.payload?._id,
        title,
        _csrf: csrfToken,
      })
      .then(response => {
        if (response.data.code === 200) {
          renameSheetRef.current?.hide(true);
        } else {
          Toast.show({
            type: 'error',
            text1: 'Unknown Error Occurred!',
            position: 'bottom',
          });
        }
      });
  }, [csrfToken, props.payload?._id, title]);
  return (
    <ActionSheet
      ref={renameSheetRef}
      gestureEnabled={true}
      CustomHeaderComponent={<></>}
      statusBarTranslucent
      overdrawSize={0}
      isModal={true}
      drawUnderStatusBar={true}
      useBottomSafeAreaPadding={true}
      containerStyle={styles.sheetContainer}>
      <View>
        <View style={styles.header}>
          <Text style={styles.headerText}>콜렉션 수정</Text>
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
              value={title}
            />
          </View>
          <Pressable
            onPress={submit}
            style={{
              paddingHorizontal: 28,
              backgroundColor: '#60B630',
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
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    // backgroundColor: 'red',
  },

  sheetContainer: {
    backgroundColor: theme.colors.background,
    // justifyContent: 'center',
    borderTopRightRadius: 45,
    borderTopLeftRadius: 45,
  },
  header: {
    margin: 30,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 17,
    color: theme.colors.black,
  },
  menuText: {
    fontSize: 12,
    color: theme.colors.black,
  },
}));
export default RenameCollectionSheet;
