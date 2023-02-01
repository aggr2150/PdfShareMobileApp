import React, {useEffect, useRef, useState} from 'react';
import {Pressable, View} from 'react-native';
import {makeStyles, Text} from '@rneui/themed';
import Separator from '@components/Seperator';
import ActionSheet, {ActionSheetRef} from 'react-native-actions-sheet';
import ThrottleFlatList from '@components/ThrottleFlatlist';
import PencilIcon from '@assets/icon/pencil2.svg';
import Book from '@components/Book';
import Avatar from '@components/Avatar';
import BoxIcon from '@assets/icon/box.svg';
import {apiInstance} from '@utils/Networking';
import {StackScreenProps} from '@react-navigation/stack';
import {useAppDispatch, useAppSelector} from '@redux/store/RootStore';
import {postAddedMany} from '@redux/reducer/postsReducer';

enum EnumSelectedIndex {
  '히스토리',
  '콜렉션',
}

type CollectionProps = StackScreenProps<HistoryStackScreenParams, 'Collection'>;
const Collection: React.FC<CollectionProps> = ({navigation, route}) => {
  const styles = useStyles();
  const renameSheetRef = useRef<ActionSheetRef>(null);
  const [collection, setCollection] = useState<ICollection>();
  const [fetching, setFetching] = useState(true);
  const dispatch = useAppDispatch();
  useEffect(() => {
    apiInstance
      .post('/api/feeds/collection', {collectionId: route.params._id})
      .then(response => {
        if (response.data.data.length !== 0) {
          setCollection(response.data.data.collection);
          // setData(response.data.data.feeds);
          dispatch(postAddedMany(response.data.data.feeds));
          setFetching(false);
        }
      });
  }, [dispatch, route.params._id]);

  const data = useAppSelector(state => {
    return collection?.posts.map<IPost>(
      item => state.posts.entities[item] as IPost,
    );
  });
  return (
    <View style={styles.container}>
      <ThrottleFlatList<IPost>
        data={data}
        // style={{width: '100%'}}
        ListHeaderComponent={() => {
          return (
            <View
              style={{
                marginHorizontal: 30,
                marginVertical: 30,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={{fontSize: 17}}>콜렉션 이름</Text>
              <Pressable onPress={() => renameSheetRef.current?.show()}>
                <PencilIcon fill={'#fff'} width={32} height={32} />
              </Pressable>
            </View>
          );
        }}
        ItemSeparatorComponent={Separator}
        renderItem={({item, index}) => (
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
            <Text style={styles.headerText}>콜렉션 생성</Text>
          </View>
          <Separator style={{marginVertical: 10}} />
          <View
            style={{
              flexDirection: 'row',
              marginHorizontal: 15,
            }}>
            <Avatar style={{width: 20, height: 20, marginRight: 5}} />
            <Text>콜렉션 추가</Text>
          </View>
          <Separator style={{marginVertical: 10}} />
          <View
            style={{
              marginHorizontal: 15,
              marginVertical: 5,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <BoxIcon fill={'white'} width={30} height={30} />
            <View style={{marginHorizontal: 10}}>
              <Text>저장된 PDF 보기</Text>
            </View>
          </View>
        </View>
      </ActionSheet>
    </View>
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
}));

export default Collection;
