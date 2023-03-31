import {Pressable, View} from 'react-native';
import {CommonActions, useNavigation} from '@react-navigation/native';
import Book from '@components/Book';
import {makeStyles, Text} from '@rneui/themed';
import React from 'react';
const LIST_ITEM_COLORS = ['#5DB522', '#fc86b7', '#1751D9'];
interface ColumnCardProps {
  item: IPost;
  index: number;
  numColumns?: number;
}
const ColumnCard: React.FC<ColumnCardProps> = ({
  item,
  index,
  numColumns = 3,
}) => {
  const navigation = useNavigation();
  const styles = useStyles();
  return (
    <Pressable
      onPress={() =>
        navigation.dispatch(CommonActions.navigate('Viewer', item))
      }
      style={{
        flex: 1 / numColumns,
      }}>
      <View
        style={{
          flex: 1,
          margin: 4,
        }}>
        <View
          style={{
            borderRadius: 20,
            overflow: 'hidden',
            marginVertical: 5,
          }}>
          <View
            style={{
              // marginVertical: 5,
              aspectRatio: 1 / Math.sqrt(2),
            }}>
            <Book
              title={item.title}
              author={item.author}
              thumbnail={item.thumbnail}
              color={LIST_ITEM_COLORS[Math.ceil((index + 1) / numColumns) % 3]}
            />
          </View>
        </View>
        <Text style={styles.titleLabel} numberOfLines={3}>
          {item.title}
        </Text>
        <Text style={styles.authorLabel} numberOfLines={2}>
          {item.author.nickname}
        </Text>
      </View>
    </Pressable>
    // </TouchableOpacity>
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
  titleLabel: {
    fontSize: 14,
    color: theme.colors.black,
  },
  authorLabel: {
    fontSize: 11,
    color: theme.colors.grey0,
  },
}));
export default ColumnCard;
