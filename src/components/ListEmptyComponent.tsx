import {TextStyle, View, ViewStyle} from 'react-native';
import React, {ReactNode} from 'react';
import {makeStyles, Text} from '@rneui/themed';

interface ListEmptyComponentProps {
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  children?: ReactNode;
  ExtraComponent?: ReactNode;
}
const ListEmptyComponent: React.FC<ListEmptyComponentProps> = ({
  containerStyle,
  textStyle,
  children,
  ExtraComponent,
}) => {
  const styles = useStyles();
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.text, textStyle]}>{children}</Text>
      {ExtraComponent}
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    // flex: 1,
    flexGrow: 1,
    // width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: '10%',
  },
  text: {
    fontSize: 13,
    color: theme.colors.black,
  },
}));

export default ListEmptyComponent;
