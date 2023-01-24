import React, {ReactElement} from 'react';
import {FlatList, FlatListProps, ListRenderItem} from 'react-native';

interface ThrottleFlatListProps<T> extends FlatListProps<T> {}

// function ThrottleFlatList<T>({
//   data,
// }): React.ReactElement<ThrottleFlatListProps<T>> {
//   return <FlatList data={data} renderItem={} />;
// }

const ThrottleFlatList = <T extends object>(
  props: ThrottleFlatListProps<T>,
): JSX.Element => {
  return <FlatList<T> {...props} />;
};

export default ThrottleFlatList;
