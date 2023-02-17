import React from 'react';
import {View} from 'react-native';
import {makeStyles, Text} from '@rneui/themed';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import Avatar from '@components/Avatar';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import BackButton from '@components/BackButton';
import {useAppDispatch} from '@redux/store/RootStore';

interface RevenueListHeaderProps {
  user?: IUser;
  settlement: TSettlement;
}
const RevenueListHeader: React.FC<RevenueListHeaderProps> = ({
  user,
  settlement,
}) => {
  const styles = useStyles();
  const navigation =
    useNavigation<NavigationProp<RootStackParamList, 'ProfileTab'>>();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  console.log(settlement);
  return (
    // <Provider>
    <View>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          // marginBottom: 24,
        }}>
        <View
          style={{
            height: 32,
            // alignSelf: '',
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            // marginHorizontal: 15,
            // paddingTop: 10,
            paddingRight: insets.right || 15,
            paddingLeft: insets.left || 15,
          }}>
          <BackButton onPress={() => navigation.goBack()} color={'white'} />
        </View>
        <View
          style={{
            marginBottom: 12,
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <Avatar avatar={user?.avatar} />
        </View>
        <View style={{marginBottom: 4}}>
          <Text style={styles.nicknameText}>{user?.nickname}</Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <View style={{marginHorizontal: 20}}>
            <Text style={styles.counterText}>
              구독자 {user?.subscriberCounter}명
            </Text>
          </View>
          <View style={{marginHorizontal: 20}}>
            <Text style={styles.counterText}>PDF {user?.postCounter}개</Text>
          </View>
        </View>
      </View>
      <View style={{flex: 1, alignItems: 'center', padding: 15}}>
        <Text style={{fontSize: 14, paddingVertical: 10}}>
          내 PDF 광고 예상 수익
        </Text>
        <View
          style={{
            borderRadius: 50,
            // borderWidth: 0.3,
            borderWidth: 1,
            borderColor: '#e9e9e9',
            paddingVertical: 16,
            paddingHorizontal: 32,
          }}>
          <Text style={{fontSize: 14, color: '#99c729'}}>
            ₩{' '}
            {(
              (settlement.postViewCounter - settlement.settledViewCounter) *
              0.5
            ).toFixed(0)}
          </Text>
        </View>
        <Text style={{fontSize: 14, paddingVertical: 10}}>
          정산 수익 :{' '}
          <Text style={{fontSize: 14, color: '#99c729'}}>
            ₩ {settlement.settledAmount}
          </Text>
        </Text>
      </View>
    </View>
    // </Provider>
  );
};

const useStyles = makeStyles(theme => ({
  subscribeButtonTitle: {
    fontFamily: 'Apple SD Gothic Neo',
    fontSize: 13,
  },
  nicknameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.black,
  },
  counterText: {
    fontSize: 12,
    color: theme.colors.black,
  },
  header: {
    margin: 30,
    alignItems: 'center',
  },
  menuText: {
    fontSize: 12,
    color: theme.colors.black,
  },
  textInput: {
    marginBottom: 7,
    backgroundColor: theme.colors.white,
    color: theme.colors.black,
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
    color: theme.colors.white,
  },
}));
export default RevenueListHeader;
