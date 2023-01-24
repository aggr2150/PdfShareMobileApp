import LoginSheet from '@components/sheets/LoginSheet';
import {registerSheet} from 'react-native-actions-sheet';
import CollectionSheet from '@components/sheets/CollectionSheet';
import CommentSheet from '@components/sheets/CommentSheet';

registerSheet('loginSheet', LoginSheet);
registerSheet('collectionSheet', CollectionSheet);
registerSheet('commentSheet', CommentSheet);
export {};
