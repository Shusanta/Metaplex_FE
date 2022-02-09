import React from 'react';
import styles from './SearchBar.module.scss';
import explorerStore from '../store/store';
export function SearchBar() {
  const [inputText, setInputText] = React.useState("");

  const keyDownHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === "Enter" && inputText != explorerStore.query) {
    
    }
  };


  return (<>
    <input placeholder="Enter Post Title" className ={styles.searchBar} onChange={event => setInputText(event.target.value) onkeyDown={}} />
  </>)
}