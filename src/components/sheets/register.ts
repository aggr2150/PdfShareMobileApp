import LoginSheet from '@components/sheets/LoginSheet';
import {registerSheet} from 'react-native-actions-sheet';
import CollectionSheet from '@components/sheets/CollectionSheet';
import CommentSheet from '@components/sheets/CommentSheet';
import AppendToCollectionSheet from '@components/sheets/AppendToCollectionSheet';

registerSheet('loginSheet', LoginSheet);
registerSheet('collectionSheet', CollectionSheet);
registerSheet('commentSheet', CommentSheet);
registerSheet('appendToCollectionSheet', AppendToCollectionSheet);
export {};
