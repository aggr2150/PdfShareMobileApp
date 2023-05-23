import React from 'react';
import {ColorValue, Pressable, View} from 'react-native';
import {makeStyles, Text} from '@rneui/themed';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import Book from '@components/book/Book';
import {humanizeNumber} from '@utils/Humanize';
import InterstitialAdsController from '@components/InterstitialAdsController';

type BookColors = {
  book: ColorValue;
  background: ColorValue;
};
interface BookCardProps {
  item: IPost;
  index: number;
  colors?: BookColors[];
}
// const adUnitId = __DEV__
//   ? TestIds.INTERSTITIAL
//   : Platform.OS === 'android'
//   ? 'ca-app-pub-9881103194147827~4317322839'
//   : 'ca-app-pub-9881103194147827~1787346509';

// const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
//   requestNonPersonalizedAdsOnly: true,
//   // keywords: ['fashion', 'clothing'],
// });

// interstitial.load();
const BookCard: React.FC<BookCardProps> = ({
  item,
  index,
  colors = [
    {background: '#1750dd', book: '#fc86b7'},
    {background: '#60B630', book: '#1750dd'},
    {background: '#fc86b7', book: '#60B630'},
  ],
}) => {
  const styles = useStyles();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <Pressable
      onPress={() => {
        // InterstitialAdsController.requestAds();
        // linkTo(`/post/${item._id}`);

        // navigation.dispatch(
        //   CommonActions.navigate({name: 'Viewer', params: item}),
        // );
        navigation.navigate('Pdf', {screen: 'Viewer', params: item});
      }}
      style={{
        aspectRatio: 16 / 9,
        backgroundColor: colors[index % 3].background,
        width: '100%',
      }}>
      <View
        style={{
          flexDirection: 'row',
          padding: 24,
          justifyContent: 'space-between',
        }}>
        <View style={{flex: 1, margin: 8, justifyContent: 'space-between'}}>
          <View>
            <Text
              style={{fontSize: 22, fontWeight: 'bold', marginBottom: 24}}
              numberOfLines={2}>
              {item?.title}
            </Text>
            <Text style={{fontSize: 12}} numberOfLines={3}>
              {item?.content}
            </Text>
          </View>
          <View>
            <Text
              style={{marginTop: 5, fontSize: 12, alignSelf: 'flex-end'}}
              numberOfLines={1}>
              {item?.author?.nickname}
            </Text>
            <Text style={{marginTop: 5, fontSize: 12, alignSelf: 'flex-start'}}>
              조회수 {humanizeNumber(item?.viewCounter)}
              {/*{humanizeNumber(2533)}*/}
            </Text>
          </View>
        </View>
        <View
          style={{
            // flex: 1,
            marginLeft: 32,
            aspectRatio: 3 / 4,
            // backgroundColor: 'white',
            height: '100%',
          }}>
          <View
            style={{
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.22,
              shadowRadius: 2.22,
              elevation: 3,
              position: 'absolute',
              top: 12,
              // right: 50,
              left: 10,
              backgroundColor: 'white',
              // flex: 1,
              height: '70%',
              // width: '100%',
              aspectRatio: 1 / Math.sqrt(2),
            }}>
            <Book
              author={item?.author}
              document={item?.document}
              documentThumbnail={item?.documentThumbnail}
              thumbnail={item?.documentThumbnail}
              title={item?.title}
            />
            {/*<View*/}
            {/*  style={{*/}
            {/*    width: '100%',*/}
            {/*    height: '100%',*/}
            {/*    backgroundColor: 'yellow',*/}
            {/*  }}></View>*/}
          </View>
          <View
            style={{
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.22,
              shadowRadius: 2.22,
              elevation: 3,
              position: 'absolute',
              right: 10,
              bottom: 12,
              height: '70%',
              aspectRatio: 1 / Math.sqrt(2),
            }}>
            <Book
              author={item?.author}
              document={item?.document}
              documentThumbnail={item?.documentThumbnail}
              thumbnail={item?.thumbnail}
              title={item?.title}
              color={colors[index % 3].book}
            />
          </View>
        </View>
        {/*<Text>{item._id}</Text>*/}
      </View>
    </Pressable>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: 25,
    // justifyContent: 'center',
    borderTopRightRadius: 45,
    borderTopLeftRadius: 45,
  },
}));
export default BookCard;
