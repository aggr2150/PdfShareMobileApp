import React from 'react';
import {makeStyles} from '@rneui/themed';
import ThrottleFlatList from '@components/ThrottleFlatlist';
import BookCard from '@components/BookCard';
import {FlatList} from 'react-native';

const SecondScene: React.FC = () => {
  const styles = useStyles();
  return (
    <FlatList<TPlace>
      data={Array(20)}
      contentContainerStyle={{width: '100%'}}
      renderItem={({item, index}) => <BookCard item={item} index={index} />}
    />
    // <ThrottleFlatList<TPlace>
    //   data={Array(20)}
    //   contentContainerStyle={{width: '100%'}}
    //   renderItem={BookCard}
    // />
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
export default SecondScene;
