import React from "react";
import { SearchBar } from "../searchBar/SearchBar";
import MintData from "../mintData/MintData";
import styles from "./Home.module.scss";
import NftGallery from "../nftGallery/NftGallery";
export function Home() {
  return (
    <>
      <header className={styles.header}></header>
      <div className={styles.landingPage}>
        <div>
          <SearchBar />
        </div>
        <div>
          <MintData />
        </div>
        <div>
          <NftGallery />
        </div>
      </div>
    </>
  );
}
