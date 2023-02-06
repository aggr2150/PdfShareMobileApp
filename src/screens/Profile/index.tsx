import React, {useEffect, useMemo, useState} from 'react';
import {FlatList, ScrollView, View} from 'react-native';
import {Button, Text} from '@rneui/themed';
import {useNavigation, useRoute} from '@react-navigation/native';
import ThrottleFlatList from '@components/ThrottleFlatlist';
import ToggleBtn from '@components/ToggleBtn';
import Avatar from '@components/Avatar';
import ProfileListHeader from '@screens/Profile/ProfileListHeader';
import BookCard from '@components/BookCard';
import Spinner from '@components/Spinner';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
} from 'react-native-reanimated';
import {useAppDispatch, useAppSelector} from '@redux/store/RootStore';
import {StackScreenProps} from '@react-navigation/stack';
import {selectById, userAdded} from '@redux/reducer/usersReducer';
import {apiInstance} from '@utils/Networking';
import {postAddedMany} from '@redux/reducer/postsReducer';
import {
  likeAddedMany,
  selectAll,
  setAllLike,
} from '@redux/reducer/likesReducer';
import {getSession} from '@redux/reducer/authReducer';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';

enum ETabIndex {
  'PDF',
  'Likes',
  'Follow',
}

type ProfileProps = StackScreenProps<
  ProfileStackScreenParams,
  'Profile' | 'My'
>;
const Profile: React.FC<ProfileProps> = ({navigation, route}) => {
  // const navigation = useNavigation();
  // const route = useRoute();
  // route.params.id
  const insets = useSafeAreaInsets();
  const [selectedIndex, setSelectedIndex] = useState<ETabIndex>(ETabIndex.PDF);
  const session = useAppSelector(state => getSession(state));
  const user = useAppSelector(state =>
    selectById(state.users, route.params?.id || state.auth.session?.id || ''),
  );
  const [tabData, setTabData] = useState<[IPost[], ILikePost[], IPost[]]>([
    [],
    [],
    [],
  ]);
  const PDFData = useAppSelector(state => {
    return tabData[selectedIndex].map(
      item => state.posts.entities[item._id] || item,
    );
  });
  // const LikesData = useAppSelector(state => {
  //   // state.likes
  //   return tabData[selectedIndex].map(
  //     item => state.posts.entities[item._id] || item,
  //   );
  // });
  const LikesData = useAppSelector(state => {
    return selectAll(state.likes).map(
      item => state.posts.entities[item._id] as ILikePost,
    );
  });
  const FollowData = useAppSelector(state => {
    return tabData[selectedIndex].map(
      item => state.posts.entities[item._id] || item,
    );
  });
  const dispatch = useAppDispatch();
  useEffect(() => {
    apiInstance
      .post<response<{user?: IUser; feeds: IPost[]; likes: ILikePost[]}>>(
        '/api/user',
        {
          id: route.params?.id,
        },
      )
      .then(response => {
        if (response.data.code === 200 && response.data.data.user) {
          dispatch(userAdded(response.data.data.user));
          console.log(response.data.data.user);
          if (response.data.data.feeds.length !== 0) {
            setTabData(prevState => [
              response.data.data.feeds,
              response.data.data.likes,
              prevState[2],
            ]);
            dispatch(postAddedMany(response.data.data.feeds));
          }
          if (
            response.data.data.likes &&
            response.data.data.likes.length !== 0
          ) {
            dispatch(setAllLike(response.data.data.likes));
          }
        }
      });
  }, [dispatch, route.params?.id]);
  let data;
  const renderItem = useMemo<
    React.FC<{item: IPost; index: number}>
  >((): React.FC<{item: IPost; index: number}> => {
    switch (selectedIndex) {
      case ETabIndex.PDF:
        return ({item, index}) => (
          <Animated.View entering={FadeIn}>
            <BookCard item={item} index={index} />
          </Animated.View>
        );
      case ETabIndex.Follow:
        return ({item, index}) => (
          <Animated.View entering={FadeIn}>
            <BookCard item={item} index={index} />
          </Animated.View>
        );
      case ETabIndex.Likes:
        return ({item, index}) => (
          <Animated.View entering={FadeIn}>
            <BookCard item={item} index={index} />
          </Animated.View>
        );
    }
  }, [selectedIndex]);
  switch (selectedIndex) {
    case 0:
      data = PDFData;
      break;
    case 1:
      data = LikesData;
      break;
    case 2:
      data = FollowData;
      break;
  }
  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingRight: insets.right,
        paddingLeft: insets.left,
        overflow: 'visible',
        flex: 1,
      }}>
      {!user ? (
        <Spinner />
      ) : (
        <FlatList<IPost>
          data={data}
          // extraData={data}
          // showsVerticalScrollIndicator={false}
          scrollIndicatorInsets={{right: 0}}
          // style={{width: '100%'}}
          // exiting={SlideOutLeft}
          // style={{overflow: 'visible'}}
          // contentContainerStyle={{width: '100%'}}
          ListHeaderComponent={() => (
            <ProfileListHeader
              user={user}
              isMine={session?._id === user._id}
              selectedIndex={selectedIndex}
              setSelectedIndex={setSelectedIndex}
            />
          )}
          renderItem={renderItem}
          keyExtractor={item => `${selectedIndex}${item._id}`}
        />
      )}
    </View>
  );
  // ) : (
  //   <Spinner />
  // );
};

export default Profile;
