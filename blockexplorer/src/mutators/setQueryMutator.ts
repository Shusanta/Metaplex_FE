import { mutatorAction } from 'satcheljs';
import  explorerStore  from '../store/Store';


/**
 * Sets client-side readingPane position
 * @param clientReadingPanePosition Client-side reading pane position
 */
export default mutatorAction(
    'setQuery',
    (query: string) => {
      explorerStore.query = query;
    }
);
