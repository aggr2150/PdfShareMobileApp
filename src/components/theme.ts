import {createTheme} from '@rneui/themed';

export default createTheme({
  components: {
    Button: {
      raised: true,
    },
    Text: {
      style: {
        fontFamily: 'Apple SD Gothic Neo',
      },
    },
  },
  lightColors: {
    black: '#262626',
  },
});
