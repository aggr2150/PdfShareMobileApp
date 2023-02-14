import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Pressable, TextInput, View} from 'react-native';
import {makeStyles, Text} from '@rneui/themed';
import Separator from '@components/Seperator';
import ActionSheet, {ActionSheetRef} from 'react-native-actions-sheet';
import ThrottleFlatList from '@components/ThrottleFlatlist';
import Book from '@components/Book';
import {apiInstance, getCsrfToken} from '@utils/Networking';
import {StackScreenProps} from '@react-navigation/stack';
import {useAppDispatch, useAppSelector} from '@redux/store/RootStore';
import {postAddedMany, postSetMany} from '@redux/reducer/postsReducer';
import {SafeAreaView} from 'react-native-safe-area-context';
import BackButton from '@components/BackButton';
import Toast from 'react-native-toast-message';
import {Button, Menu, Provider} from 'react-native-paper';
import CollectionHeader from '@screens/History/CollectionList/CollectionHeader';

type CollectionProps = StackScreenProps<HistoryStackScreenParams, 'Collection'>;
const Collection: React.FC<CollectionProps> = ({navigation, route}) => {
  const styles = useStyles();
  const renameSheetRef = useRef<ActionSheetRef>(null);
  const [collection, setCollection] = useState<ICollection>();
  const [fetching, setFetching] = useState(true);
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState(collection?.title);
  const [csrfToken, setCsrfToken] = useState<string>();
  const [visible, setVisible] = React.useState(false);
  const initialize = useCallback(() => {
    apiInstance
      .post('/api/feeds/collection', {collectionId: route.params._id})
      .then(response => {
        if (response.data.data.length !== 0) {
          setCollection(response.data.data.collection);
          // setData(response.data.data.feeds);
          console.log('feeds', response.data.data);
          setTitle(response.data.data.collection.title);
          dispatch(postSetMany(response.data.data.feeds));
          setFetching(false);
        }
      });
  }, [dispatch, route.params._id]);

  useEffect(() => {
    getCsrfToken.then(token => setCsrfToken(token));
    initialize();
  }, [initialize]);

  const data = useAppSelector(state => {
    return collection?.posts.map<IPost>(item => {
      console.log(state.posts.entities[item], item);
      return state.posts.entities[item] as IPost;
    });
  });
  const closeMenu = () => setVisible(false);
  const openMenu = () => setVisible(true);
  const submit = useCallback(() => {
    apiInstance
      .post('/api/collection/edit', {
        collectionId: route.params._id,
        title,
        _csrf: csrfToken,
      })
      .then(response => {
        if (response.data.code === 200) {
          initialize();
          renameSheetRef.current?.hide();
        } else {
          Toast.show({
            type: 'error',
            text1: 'Unknown Error Occurred!',
            position: 'bottom',
          });
        }
      });
  }, [csrfToken, initialize, route.params._id, title]);
  const openSheet = () => renameSheetRef.current?.show();
  return (
    <SafeAreaView style={styles.container}>
      <Provider>
        <ThrottleFlatList<IPost>
          data={data}
          // style={{width: '100%'}}
          ListHeaderComponent={() => (
            <CollectionHeader collection={collection} openSheet={openSheet} />
          )}
          ItemSeparatorComponent={Separator}
          renderItem={({item}) => (
            <Pressable
              onPress={() => {
                navigation.navigate('Viewer', item);
              }}
              style={{
                backgroundColor: '#282828',
                paddingHorizontal: 21,
                paddingVertical: 21,
                aspectRatio: 32 / 12,
                flexDirection: 'row',
                justifyContent: 'space-between',
                flex: 1,
              }}>
              <View style={{flex: 1}}>
                <Book
                  author={item.author}
                  title={item.title}
                  thumbnail={item.thumbnail}
                />
              </View>
              <View style={{justifyContent: 'space-between'}}>
                <Text
                  style={{fontSize: 22, textAlign: 'right', marginBottom: 37}}>
                  {item.title}
                </Text>
                {/*<Menu*/}
                {/*  visible={visible}*/}
                {/*  onDismiss={closeMenu}*/}
                {/*  style={{zIndex: 100}}*/}
                {/*  anchor={<Button onPress={openMenu}>Show menu</Button>}>*/}
                {/*  <Menu.Item onPress={() => {}} title="Item 1" />*/}
                {/*  <Menu.Item onPress={() => {}} title="Item 2" />*/}
                {/*  /!*<Divider />*!/*/}
                {/*  <Menu.Item onPress={() => {}} title="Item 3" />*/}
                {/*</Menu>*/}
                <Text style={{fontSize: 16, textAlign: 'right'}}>
                  {item.author.nickname}
                </Text>
              </View>
            </Pressable>
          )}
        />
        <ActionSheet
          ref={renameSheetRef}
          // closable={false}
          // headerAlwaysVisible={false}
          gestureEnabled={true}
          CustomHeaderComponent={<></>}
          statusBarTranslucent
          overdrawSize={0}
          isModal={true}
          // indicatorStyle={{height: 100}}
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
      </Provider>
    </SafeAreaView>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    // alignItems: 'center',
    backgroundColor: theme.colors.background,
  },

  sheetContainer: {
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
  menuText: {
    fontSize: 12,
    color: theme.colors.black,
    width: 300,
    height: 300,
    backgroundColor: 'red',
  },
}));

export default Collection;
