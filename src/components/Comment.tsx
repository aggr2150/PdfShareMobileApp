import {TouchableOpacity, View} from 'react-native';
import Avatar from '@components/Avatar';
import {Text} from '@rneui/themed';
import React from 'react';
import CommentMenu from '@components/CommentMenu';
import HeartIcon from '@assets/icon/heart.svg';
import HeartOutLineIcon from '@assets/icon/heart-outline.svg';
import {humanizeNumber} from '@utils/Humanize';
import {NavigationProp} from '@react-navigation/native';

interface CommentProps {
  item: IComment;
  isMine: boolean;
  session: Nullable<ISession>;
  likeCallback: (comment: IComment) => void;
  deleteCallback: (comment: IComment) => void;
  navigation: NavigationProp<RootStackParamList>;
}
const Comment: React.FC<CommentProps> = ({
  item,
  isMine,
  navigation,
  likeCallback,
  deleteCallback,
  session,
}) => {
  return (
    <View
      style={{marginVertical: 6, paddingLeft: item.parentCommentId ? 48 : 24}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: 20,
              height: 20,
              maxWidth: 20,
              marginRight: 4,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Avatar style={{width: 20, height: 20}} />
          </View>
          <Text style={{fontSize: 13}}>{item.author.nickname} 님</Text>
        </View>
        <View>
          <CommentMenu
            item={item}
            session={session}
            isMine={isMine}
            deleteCallback={deleteCallback}
          />
        </View>
      </View>
      <View style={{marginLeft: 24, marginRight: 30}}>
        <View style={{marginBottom: 6}}>
          <Text style={{fontSize: 13}}>{item.content}</Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {!item.parentCommentId && (
            <TouchableOpacity
              onPress={() => navigation.navigate('Replies', item)}>
              <Text style={{fontSize: 13, marginRight: 12, color: '#afafaf'}}>
                답글 {item.replyCounter !== 0 && `${item.replyCounter} 개`}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={() => likeCallback(item)}>
            {item.likeStatus ? (
              <HeartIcon fill={'#99c729'} width={24} height={24} />
            ) : (
              <HeartOutLineIcon fill={'#99c729'} width={24} height={24} />
            )}
          </TouchableOpacity>
          <View
            style={{
              justifyContent: 'flex-start',
              flex: 1,
              alignSelf: 'center',
            }}>
            <Text style={{fontSize: 13, color: '#afafaf'}}>
              {humanizeNumber(item.likeCounter)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

// const useStyles = makeStyles(theme => ({
//   menuText: {
//     fontSize: 12,
//     color: theme.colors.black,
//   },
// }));
export default Comment;
