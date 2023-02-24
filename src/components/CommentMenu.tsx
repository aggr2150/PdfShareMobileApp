import {TouchableOpacity} from 'react-native';
import {makeStyles, Text} from '@rneui/themed';
import React from 'react';
import DotIcon from '@assets/icon/dot.svg';
import {Menu} from 'react-native-paper';
import {SheetManager} from 'react-native-actions-sheet';

const CommentMenu: React.FC<{
  item: IComment;
  isMine: boolean;
  session: Nullable<ISession>;
  deleteCallback: (comment: IComment) => void;
}> = ({item, isMine, session, deleteCallback}) => {
  const styles = useStyles();
  const [visible, setVisible] = React.useState(false);
  const closeMenu = () => setVisible(false);
  const openMenu = () => setVisible(true);
  return (
    <Menu
      visible={visible}
      onDismiss={closeMenu}
      contentStyle={{backgroundColor: 'black'}}
      anchorPosition={'bottom'}
      anchor={
        <TouchableOpacity
          onPress={openMenu}
          style={{
            width: 32,
            height: 32,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <DotIcon fill={'white'} width={24} height={24} />
        </TouchableOpacity>
      }>
      {isMine ? (
        <>
          <Menu.Item
            dense={true}
            onPress={() => {
              // openSheet();
              closeMenu();
            }}
            title={<Text style={styles.menuText}>수정</Text>}
          />
          <Menu.Item
            dense={true}
            onPress={() => {
              deleteCallback(item);
              closeMenu();
            }}
            title={<Text style={styles.menuText}>삭제</Text>}
          />
        </>
      ) : (
        <>
          <Menu.Item
            dense={true}
            onPress={() => {
              session
                ? console.log('112')
                : SheetManager.show('loginSheet', {
                    payload: {closable: true},
                  }).then();
              closeMenu();
            }}
            title={<Text style={styles.menuText}>차단</Text>}
          />
        </>
      )}
    </Menu>
  );
};

const useStyles = makeStyles(theme => ({
  menuText: {
    fontSize: 12,
    color: theme.colors.black,
  },
}));
export default CommentMenu;
